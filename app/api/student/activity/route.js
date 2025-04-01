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

    // Get user from database
    const User = (await import("@/app/models/User")).default;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Import required models
    const Enrollment = (await import("@/app/models/Enrollment")).default;
    const Completion = (await import("@/app/models/Completion")).default;
    const Course = (await import("@/app/models/Course")).default;

    // Get recent lesson completions
    const completions = await Completion.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "course",
        select: "title slug",
      })
      .populate({
        path: "lesson",
        select: "title",
      });

    // Get recent enrollments
    const enrollments = await Enrollment.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: "course",
        select: "title slug",
      });

    // Combine activities
    const activities = [
      // Lesson completions
      ...completions.map((completion) => ({
        id: `completion-${completion._id}`,
        type: "lesson_completed",
        course: completion.course?.title || "Unknown Course",
        detail: completion.lesson?.title || "Unknown Lesson",
        date: completion.createdAt.toISOString(),
      })),

      // Enrollments (course started)
      ...enrollments.map((enrollment) => ({
        id: `enrollment-${enrollment._id}`,
        type: "course_started",
        course: enrollment.course?.title || "Unknown Course",
        detail: "",
        date: enrollment.createdAt.toISOString(),
      })),
    ];

    // Simulate certificate earned and course completed activities
    // In a real app, these would come from their own models or from enrollment updates
    const mockCertificates = enrollments
      .filter((e) => e.certificateIssued)
      .map((enrollment) => ({
        id: `certificate-${enrollment._id}`,
        type: "certificate_earned",
        course: enrollment.course?.title || "Unknown Course",
        detail: "",
        date: enrollment.updatedAt.toISOString(),
      }));

    // Sort all activities by date (newest first)
    const allActivities = [...activities, ...mockCertificates]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Limit to 10 activities

    return NextResponse.json({
      success: true,
      data: allActivities,
    });
  } catch (error) {
    console.error("Error fetching student activity:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
