import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req, { params }) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    // Only students can enroll in courses
    if (profile.role !== 'student') {
      return new NextResponse("Only students can enroll in courses", { status: 403 });
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
      return new NextResponse("Already enrolled", { status: 400 });
    }

    // Create new enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert([
        {
          user_id: user.id,
          course_id: course.id,
          status: "active",
          progress: 0,
        }
      ])
      .select()
      .single();

    if (enrollmentError) {
      console.error("Error enrolling in course:", enrollmentError);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
