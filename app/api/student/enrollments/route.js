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

    // Get user from database to verify they are a student
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

    // Find all enrollments for this user
    const enrollments = await Enrollment.find({ user: user._id })
      .populate({
        path: "course",
        select:
          "title slug description thumbnail duration instructor level isPublished category",
        populate: {
          path: "instructor",
          select: "name",
        },
      })
      .sort({ updatedAt: -1 });

    // Get lesson completions for calculating progress
    const courseIds = enrollments.map((enrollment) => enrollment.course._id);
    const completions = await Completion.find({
      user: user._id,
      course: { $in: courseIds },
    });

    // Process enrollments to add progress data
    const processedEnrollments = enrollments.map((enrollment) => {
      const courseId = enrollment.course._id.toString();

      // Calculate progress for this course
      let progress = 0;
      const courseLessons = enrollment.course.lessons || [];

      if (courseLessons.length > 0) {
        const completedLessons = completions.filter(
          (completion) => completion.course.toString() === courseId
        ).length;

        progress = Math.round((completedLessons / courseLessons.length) * 100);
      }

      // Format the enrollment data
      return {
        id: enrollment._id.toString(),
        course: {
          id: enrollment.course._id.toString(),
          title: enrollment.course.title,
          slug: enrollment.course.slug,
          description: enrollment.course.description,
          thumbnail: enrollment.course.thumbnail,
          duration: enrollment.course.duration,
          level: enrollment.course.level,
          instructor:
            enrollment.course.instructor?.name || "Unknown Instructor",
        },
        progress: progress,
        certificateIssued: enrollment.certificateIssued || false,
        lastAccessed: enrollment.updatedAt.toISOString(),
        enrolledAt: enrollment.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: processedEnrollments,
    });
  } catch (error) {
    console.error("Error fetching student enrollments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
