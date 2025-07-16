import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req, { params }) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { slug } = params;

    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (courseError || !course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if user is already enrolled
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single();

    if (existingEnrollment) {
      return new NextResponse("Already enrolled in this course", { status: 400 });
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert([
        {
          user_id: user.id,
          course_id: course.id,
          enrolled_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (enrollmentError) {
      console.error("Enrollment error:", enrollmentError);
      return new NextResponse("Error enrolling in course", { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error) {
    console.error("Error in POST /api/courses/[slug]/enroll:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { slug } = params;

    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (courseError || !course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Delete enrollment
    const { error: deleteError } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', course.id);

    if (deleteError) {
      console.error("Unenrollment error:", deleteError);
      return new NextResponse("Error unenrolling from course", { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully unenrolled from course",
    });
  } catch (error) {
    console.error("Error in DELETE /api/courses/[slug]/enroll:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
