import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    console.log("🎯 Instructor courses API called");
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("❌ Auth error:", authError?.message || "No user");
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log("✅ User authenticated:", user.email);

    // Check if user has instructor role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log("👤 User profile:", profile);

    if (profileError || (profile?.role !== 'instructor' && profile?.role !== 'admin')) {
      console.log("❌ Role check failed:", profile?.role, profileError?.message);
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Instructor role required' },
        { status: 403 }
      );
    }

    console.log("✅ Role check passed:", profile.role);

    // Get courses created by this instructor
    console.log("📚 Fetching courses for instructor:", user.id);
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
      console.log("❌ Courses fetch error:", coursesError.message);
      throw coursesError;
    }

    console.log("✅ Courses fetched:", courses?.length || 0, "courses");

    // Calculate enrollment counts and average ratings
    const coursesWithStats = courses?.map(course => ({
      ...course,
      _id: course.id, // Map id to _id for frontend compatibility
      enrollmentCount: course.enrollments?.length || 0, // camelCase version
      enrollment_count: course.enrollments?.length || 0, // snake_case version
      averageRating: course.reviews?.length > 0  // camelCase version
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0,
      average_rating: course.reviews?.length > 0  // snake_case version
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0,
    })) || [];

    console.log("🎉 Returning courses response:", {
      success: true,
      count: coursesWithStats.length,
      sample: coursesWithStats[0] || null
    });

    return NextResponse.json({
      success: true,
      data: coursesWithStats,
    });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
