import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/database";
import Course from "@/models/Course";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";

export async function POST(req, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const course = await Course.findOne({ slug: params.slug });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
    });

    if (existingEnrollment) {
      return new NextResponse("Already enrolled", { status: 400 });
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      user: user._id,
      course: course._id,
      status: "in-progress",
      progress: 0,
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
