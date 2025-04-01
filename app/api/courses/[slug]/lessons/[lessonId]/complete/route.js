import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import Enrollment from "@/models/Enrollment";
import Completion from "@/models/Completion";

export async function POST(req, { params }) {
  try {
    // Get the authenticated user ID
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, lessonId } = params;

    // Connect to database
    await connectToDB();

    // Find the user, course, and lesson
    const user = await User.findOne({ clerkId: userId });
    const course = await Course.findOne({ slug });
    const lesson = await Lesson.findById(lessonId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if the user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 400 }
      );
    }

    // Check if lesson already completed
    const existingCompletion = await Completion.findOne({
      user: user._id,
      lesson: lesson._id,
    });

    if (existingCompletion) {
      return NextResponse.json({
        message: "Lesson already completed",
        completion: existingCompletion,
      });
    }

    // Create a new completion record
    const completion = new Completion({
      user: user._id,
      course: course._id,
      lesson: lesson._id,
    });

    await completion.save();

    // Update the enrollment progress
    const totalLessons = await Lesson.countDocuments({ course: course._id });
    const completedLessons = await Completion.countDocuments({
      user: user._id,
      course: course._id,
    });

    const progressPercentage = Math.round(
      (completedLessons / totalLessons) * 100
    );

    enrollment.progress = progressPercentage;
    enrollment.isCompleted = progressPercentage === 100;

    await enrollment.save();

    return NextResponse.json({
      message: "Lesson marked as complete",
      completion: {
        id: completion._id,
        courseId: course._id,
        lessonId: lesson._id,
        completedAt: completion.createdAt,
      },
      progress: progressPercentage,
    });
  } catch (error) {
    console.error("Error marking lesson as complete:", error);
    return NextResponse.json(
      { error: "Failed to mark lesson as complete" },
      { status: 500 }
    );
  }
}
