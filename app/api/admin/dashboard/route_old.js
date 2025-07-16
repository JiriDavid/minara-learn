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

    // Get user from database to verify they are an admin
    const User = (await import("@/app/models/User")).default;
    const user = await User.findOne({ clerkId: userId });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin role required" },
        { status: 403 }
      );
    }

    // Import required models
    const Course = (await import("@/app/models/Course")).default;
    const Enrollment = (await import("@/app/models/Enrollment")).default;
    const Review = (await import("@/app/models/Review")).default;

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Calculate revenue (in a real app, this would come from a payment model)
    // For now, we'll calculate it based on enrollments with a fixed price
    const averageCoursePrice = 49.99;
    const totalRevenue = totalEnrollments * averageCoursePrice;

    // Get user distribution by role
    const students = await User.countDocuments({ role: "student" });
    const lecturers = await User.countDocuments({ role: "lecturer" });
    const admins = await User.countDocuments({ role: "admin" });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select("name email role createdAt");

    // Get popular courses
    const popularCourses = await Course.find()
      .sort({ enrollmentCount: -1 })
      .limit(3)
      .populate("instructor", "name")
      .select("title enrollmentCount averageRating");

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("user", "name")
      .populate("course", "title");

    // Transform the data for the dashboard
    const dashboardData = {
      totalUsers,
      totalCourses,
      totalRevenue,
      totalEnrollments,
      usersByRole: {
        student: students,
        lecturer: lecturers,
        admin: admins,
      },
      recentUsers: recentUsers.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
      })),
      popularCourses: popularCourses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        instructor: course.instructor?.name || "Unknown Instructor",
        enrollments: course.enrollmentCount || 0,
        rating: course.averageRating || 0,
        revenue: (course.enrollmentCount || 0) * averageCoursePrice,
      })),
      recentEnrollments: recentEnrollments.map((enrollment) => ({
        id: enrollment._id.toString(),
        user: enrollment.user?.name || "Anonymous User",
        course: enrollment.course?.title || "Unknown Course",
        date: enrollment.createdAt,
      })),
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
