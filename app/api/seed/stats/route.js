import { NextResponse } from "next/server";
import connectToDB from "@/lib/database";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";

export async function GET() {
  try {
    await connectToDB();

    // User stats
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: "student" });
    const lecturerCount = await User.countDocuments({ role: "lecturer" });
    const adminCount = await User.countDocuments({ role: "admin" });

    // Course stats
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const draftCourses = await Course.countDocuments({ isPublished: false });

    // Enrollment stats
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({
      isCompleted: true,
    });
    const activeEnrollments = await Enrollment.countDocuments({
      isCompleted: false,
    });

    // Calculate average lessons per course
    const courseData = await Course.aggregate([
      { $group: { _id: null, totalLessons: { $sum: "$lessons" } } },
    ]);
    const averageLessons =
      courseData.length > 0 && totalCourses > 0
        ? Math.round(courseData[0].totalLessons / totalCourses)
        : 0;

    return NextResponse.json({
      success: true,
      users: {
        total: totalUsers,
        students: studentCount,
        lecturers: lecturerCount,
        admins: adminCount,
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        draft: draftCourses,
        averageLessons,
      },
      enrollments: {
        total: totalEnrollments,
        completed: completedEnrollments,
        active: activeEnrollments,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats: " + error.message },
      { status: 500 }
    );
  }
}
