import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/database";
import Course from "@/models/Course";
import User from "@/models/User";

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

    // Get all courses
    const courses = await Course.find({});

    // Add sample lessons to each course
    for (const course of courses) {
      course.lessons = [
        {
          title: "Introduction",
          description: "Welcome to the course!",
          duration: 5,
          videoUrl: "https://example.com/video1.mp4",
          resources: [],
          isCompleted: false,
        },
        {
          title: "Getting Started",
          description: "Learn the basics",
          duration: 15,
          videoUrl: "https://example.com/video2.mp4",
          resources: [],
          isCompleted: false,
        },
        {
          title: "Advanced Concepts",
          description: "Dive deeper into the subject",
          duration: 20,
          videoUrl: "https://example.com/video3.mp4",
          resources: [],
          isCompleted: false,
        },
      ];

      await course.save();
    }

    return NextResponse.json({
      message: "Lessons seeded successfully",
      coursesUpdated: courses.length,
    });
  } catch (error) {
    console.error("Error seeding lessons:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
