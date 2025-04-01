import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/database";
import User from "@/models/User";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import Completion from "@/models/Completion";

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

    // Clear existing completions
    await Completion.deleteMany({});

    // Get all courses and students
    const courses = await Course.find({});
    const students = await User.find({ role: "student" });

    // Create sample completions
    const completions = [];
    for (const student of students) {
      for (const course of courses) {
        if (Math.random() < 0.3) {
          // 30% chance of completing a course
          completions.push({
            user: student._id,
            course: course._id,
            completedAt: new Date(),
            certificateUrl: "https://example.com/certificate.pdf",
          });
        }
      }
    }

    const createdCompletions = await Completion.insertMany(completions);

    return NextResponse.json({
      message: "Completions seeded successfully",
      count: createdCompletions.length,
    });
  } catch (error) {
    console.error("Error seeding completions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
