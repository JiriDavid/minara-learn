import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has instructor role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profile?.role !== 'instructor' && profile?.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Instructor role required' },
        { status: 403 }
      );
    }

    // Get courses created by this instructor
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        enrollments(count),
        reviews(rating)
      `)
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false });

    if (coursesError) {
      throw coursesError;
    }

    // Calculate enrollment counts and average ratings
    const coursesWithStats = courses?.map(course => ({
      ...course,
      enrollment_count: course.enrollments?.length || 0,
      average_rating: course.reviews?.length > 0 
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0,
    })) || [];

    return NextResponse.json({
      success: true,
      courses: coursesWithStats,
    });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
