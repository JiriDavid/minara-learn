import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/database";
import Course from "@/models/Course";
import User from "@/models/User";
import Review from "@/models/Review";

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

    // Clear existing reviews
    await Review.deleteMany({});

    // Get all courses and students
    const courses = await Course.find({});
    const students = await User.find({ role: "student" });

    // Create sample reviews
    const reviews = [];
    for (const student of students) {
      for (const course of courses) {
        if (Math.random() < 0.7) {
          // 70% chance of having a review
          reviews.push({
            user: student._id,
            course: course._id,
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
            comment: "Great course! Learned a lot.",
          });
        }
      }
    }

    const createdReviews = await Review.insertMany(reviews);

    return NextResponse.json({
      message: "Reviews seeded successfully",
      count: createdReviews.length,
    });
  } catch (error) {
    console.error("Error seeding reviews:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
