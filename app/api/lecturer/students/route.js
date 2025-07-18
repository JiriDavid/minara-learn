import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is instructor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized - Instructor role required' }, { status: 403 });
    }

    // Get instructor's courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('instructor_id', user.id);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    const courseIds = courses.map(course => course.id);

    if (courseIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        stats: {
          totalStudents: 0,
          activeStudents: 0,
          averageProgress: 0,
          averageRating: 0,
        }
      });
    }

    // Get students enrolled in instructor's courses
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id,
        progress,
        status,
        created_at,
        updated_at,
        student:profiles!enrollments_user_id_fkey(
          id,
          name,
          email,
          avatar_url
        ),
        course:courses!enrollments_course_id_fkey(
          id,
          title
        )
      `)
      .in('course_id', courseIds)
      .order('created_at', { ascending: false });

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
    }

    // Process data to group by student
    const studentsMap = new Map();
    let totalProgress = 0;
    let enrollmentCount = 0;

    enrollments.forEach(enrollment => {
      const studentId = enrollment.student.id;
      
      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          id: studentId,
          name: enrollment.student.name,
          email: enrollment.student.email,
          avatar_url: enrollment.student.avatar_url,
          enrolledCourses: [],
          totalProgress: 0,
          enrollmentCount: 0,
          lastActive: enrollment.updated_at,
          status: 'active', // You can calculate this based on recent activity
        });
      }

      const student = studentsMap.get(studentId);
      student.enrolledCourses.push({
        id: enrollment.course.id,
        title: enrollment.course.title,
        progress: enrollment.progress || 0,
        status: enrollment.status,
      });
      
      student.totalProgress += enrollment.progress || 0;
      student.enrollmentCount += 1;
      
      // Update last active if this enrollment is more recent
      if (new Date(enrollment.updated_at) > new Date(student.lastActive)) {
        student.lastActive = enrollment.updated_at;
      }

      totalProgress += enrollment.progress || 0;
      enrollmentCount += 1;
    });

    // Calculate average progress for each student
    const students = Array.from(studentsMap.values()).map(student => ({
      ...student,
      averageProgress: student.enrollmentCount > 0 
        ? Math.round(student.totalProgress / student.enrollmentCount) 
        : 0,
    }));

    // Calculate stats
    const stats = {
      totalStudents: students.length,
      activeStudents: students.filter(s => {
        const lastActive = new Date(s.lastActive);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return lastActive > weekAgo;
      }).length,
      averageProgress: enrollmentCount > 0 ? Math.round(totalProgress / enrollmentCount) : 0,
      averageRating: 4.2, // This would come from course reviews - implement later
    };

    return NextResponse.json({
      success: true,
      data: students,
      stats,
    });

  } catch (error) {
    console.error('Error in lecturer students API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
