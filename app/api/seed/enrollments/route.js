import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/database";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";

// Helper functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startDate, endDate) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
}

function generateCompletedLessons(course, percentComplete) {
  const completedLessons = [];
  let totalLessons = [];

  // Flatten lessons from all sections
  course.sections.forEach((section) => {
    section.lessons.forEach((lesson) => {
      totalLessons.push(lesson._id);
    });
  });

  // Calculate how many lessons should be completed based on percentComplete
  const lessonsToComplete = Math.floor(
    totalLessons.length * (percentComplete / 100)
  );

  // Get random lessons to mark as completed
  const selectedLessons = getRandomItems(totalLessons, lessonsToComplete);

  // Create completed lessons array with completion dates
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  selectedLessons.forEach((lessonId) => {
    completedLessons.push(lessonId);
  });

  return completedLessons;
}

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Clear existing enrollments
    await Enrollment.deleteMany({});

    // Get all courses and students
    const courses = await Course.find({});
    const students = await User.find({ role: "student" });

    // Create sample enrollments
    const enrollments = [];
    for (const student of students) {
      for (const course of courses) {
        enrollments.push({
          user: student._id,
          course: course._id,
          status: "in-progress",
          progress: Math.floor(Math.random() * 100),
        });
      }
    }

    const createdEnrollments = await Enrollment.insertMany(enrollments);

    return NextResponse.json({
      message: "Enrollments seeded successfully",
      count: createdEnrollments.length,
    });
  } catch (error) {
    console.error("Error seeding enrollments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();

    const totalCount = await Enrollment.countDocuments();
    const completedCount = await Enrollment.countDocuments({
      isCompleted: true,
    });
    const activeCount = await Enrollment.countDocuments({ isCompleted: false });

    return NextResponse.json({
      success: true,
      counts: {
        total: totalCount,
        completed: completedCount,
        active: activeCount,
      },
    });
  } catch (error) {
    console.error("Error getting enrollment stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get enrollment stats: " + error.message,
      },
      { status: 500 }
    );
  }
}
