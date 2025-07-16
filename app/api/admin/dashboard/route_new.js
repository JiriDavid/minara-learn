import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // Get dashboard statistics
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: totalCourses, error: coursesError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    const { count: totalEnrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true });

    const { count: totalReviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    // Get recent activities
    const { data: recentEnrollments, error: recentEnrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        profiles!inner(name, email),
        courses!inner(title, slug)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: recentReviews, error: recentReviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!inner(name, email),
        courses!inner(title, slug)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get top courses by enrollment
    const { data: topCourses, error: topCoursesError } = await supabase
      .from('courses')
      .select(`
        *,
        enrollments(count)
      `)
      .order('enrollments.count', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers: totalUsers || 0,
          totalCourses: totalCourses || 0,
          totalEnrollments: totalEnrollments || 0,
          totalReviews: totalReviews || 0,
        },
        recentEnrollments: recentEnrollments || [],
        recentReviews: recentReviews || [],
        topCourses: topCourses || [],
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
