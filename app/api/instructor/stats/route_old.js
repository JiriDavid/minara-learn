import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import connectToDB from "@/app/lib/db";

export async function GET(request) {
  try {
    const { userId } = await clerkClient.authenticateRequest({
      request,
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();

    // Get user from database to verify they are a lecturer
    const User = (await import("@/app/models/User")).default;
    const user = await User.findOne({ clerkId: userId });

    if (!user || user.role !== "lecturer") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Lecturer role required" },
        { status: 403 }
      );
    }

    // Import all required models
    const Course = (await import("@/app/models/Course")).default;
    const Enrollment = (await import("@/app/models/Enrollment")).default;
    const Review = (await import("@/app/models/Review")).default;
    const Completion = (await import("@/app/models/Completion")).default;

    // Get all courses created by this lecturer
    const courses = await Course.find({ instructor: user._id });
    const courseIds = courses.map((course) => course._id);

    // Get total enrolled students (unique)
    const enrollments = await Enrollment.find({ course: { $in: courseIds } });
    const uniqueStudentIds = [
      ...new Set(enrollments.map((enrollment) => enrollment.user.toString())),
    ];
    const totalStudents = uniqueStudentIds.length;

    // Calculate total revenue (you would need a payment model for real implementation)
    // For this example, we'll use mock data based on enrollments
    const totalRevenue = enrollments.length * 49.99; // Assuming average course price

    // Get average course rating
    const reviews = await Review.find({ course: { $in: courseIds } });
    const totalRatingPoints = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      reviews.length > 0 ? (totalRatingPoints / reviews.length).toFixed(1) : 0;

    // Calculate course completion rate
    const completions = await Completion.find({ lesson: { $in: [] } }); // This would need lesson IDs from all courses
    // Mock calculation for demo purposes
    const courseCompletionRate = 75; // In a real app, this would be calculated from completions data

    // Get recent enrollments (last 10)
    const recentEnrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name")
      .populate("course", "title");

    // Transform enrollments to the expected format
    const formattedEnrollments = recentEnrollments.map((enrollment) => ({
      id: enrollment._id.toString(),
      studentName: enrollment.user.name || "Anonymous Student",
      courseName: enrollment.course.title,
      date: enrollment.createdAt.toISOString().split("T")[0],
    }));

    // Get recent reviews (last 10)
    const recentReviews = await Review.find({ course: { $in: courseIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name")
      .populate("course", "title");

    // Transform reviews to the expected format
    const formattedReviews = recentReviews.map((review) => ({
      id: review._id.toString(),
      studentName: review.user.name || "Anonymous Student",
      courseName: review.course.title,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalRevenue,
        averageRating,
        courseCompletionRate,
        recentEnrollments: formattedEnrollments,
        recentReviews: formattedReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching lecturer stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch lecturer statistics" },
      { status: 500 }
    );
  }
}
