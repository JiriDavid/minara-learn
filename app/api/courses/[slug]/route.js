import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import Course from "@/models/Course";
import Section from "@/models/Section";
import Lesson from "@/models/Lesson";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Course slug is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find course by slug and populate lecturer data
    const course = await Course.findOne({ slug }).populate({
      path: "lecturer",
      select: "name image bio clerkId",
      model: User,
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // Get course sections
    const sections = await Section.find({ courseId: course._id })
      .sort({ order: 1 })
      .lean();

    // Get section lessons for each section
    const sectionsWithLessons = await Promise.all(
      sections.map(async (section) => {
        const lessons = await Lesson.find({
          sectionId: section._id,
          courseId: course._id,
        })
          .sort({ order: 1 })
          .select({
            title: 1,
            duration: 1,
            isPreview: 1,
            order: 1,
            _id: 1,
          })
          .lean();

        return {
          ...section,
          _id: section._id.toString(),
          lessons: lessons.map((lesson) => ({
            ...lesson,
            _id: lesson._id.toString(),
          })),
        };
      })
    );

    // Format the response
    const formattedCourse = {
      ...course,
      _id: course._id.toString(),
      lecturerId: course.lecturerId.toString(),
      sections: sectionsWithLessons,
      lecturer: course.lecturer
        ? {
            _id: course.lecturer._id.toString(),
            name: course.lecturer.name,
            image: course.lecturer.image,
            bio: course.lecturer.bio,
          }
        : null,
    };

    return NextResponse.json({ course: formattedCourse });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { message: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
