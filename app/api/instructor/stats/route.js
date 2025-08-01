import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    console.log("📊 Instructor stats API called");
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("❌ Stats auth error:", authError?.message || "No user");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("✅ Stats user authenticated:", user.email);

    // Check if user has instructor role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profile?.role !== 'instructor' && profile?.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Instructor role required" },
        { status: 403 }
      );
    }

    // Set cache headers for 5 minutes
    const headers = {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      'Vary': 'Authorization',
    };

    // Get instructor statistics
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, created_at')
      .eq('instructor_id', user.id);

    if (coursesError) {
      throw coursesError;
    }

    const totalCourses = courses?.length || 0;
    const courseIds = courses?.map(course => course.id) || [];

    // Get enrollment statistics
    const { count: totalEnrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .in('course_id', courseIds);

    // Get review statistics
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .in('course_id', courseIds);

    const totalReviews = reviews?.length || 0;
    const averageRating = reviews?.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    // Get recent enrollments
    const { data: recentEnrollments, error: recentEnrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        profiles!inner(name, email),
        courses!inner(title)
      `)
      .in('course_id', courseIds)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent reviews
    const { data: recentReviews, error: recentReviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!inner(name, email),
        courses!inner(title)
      `)
      .in('course_id', courseIds)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get monthly enrollment data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: monthlyEnrollments, error: monthlyEnrollmentsError } = await supabase
      .from('enrollments')
      .select('created_at')
      .in('course_id', courseIds)
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true });

    // Process monthly enrollment data
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyCount = monthlyEnrollments?.filter(enrollment => {
        const enrollmentDate = new Date(enrollment.created_at);
        return enrollmentDate >= monthStart && enrollmentDate <= monthEnd;
      }).length || 0;

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        enrollments: monthlyCount,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalStudents: totalEnrollments || 0, // Map totalEnrollments to totalStudents
        totalEnrollments: totalEnrollments || 0,
        totalRevenue: 0, // Placeholder for now
        courseCompletionRate: 0, // Placeholder for now  
        averageRating: Number(averageRating.toFixed(1)),
        recentEnrollments: recentEnrollments || [],
        recentReviews: recentReviews || [],
        stats: {
          totalCourses,
          totalEnrollments: totalEnrollments || 0,
          totalReviews,
          averageRating: Number(averageRating.toFixed(1)),
        },
        monthlyEnrollments: monthlyData,
        courses: courses || [],
      },
    }, { headers });
  } catch (error) {
    console.error("Error fetching instructor stats:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
