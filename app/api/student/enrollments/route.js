import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify user has student role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profile?.role !== 'student' && profile?.role !== 'admin')) {
      return new NextResponse("Forbidden - Student access required", { status: 403 });
    }

    // Get user's enrollments with course details
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        course:courses(
          id,
          title,
          slug,
          thumbnail,
          duration,
          instructor:profiles!instructor_id(name)
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (enrollmentsError) {
      console.error("Error fetching enrollments:", enrollmentsError);
      return new NextResponse("Error fetching enrollments", { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedEnrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      title: enrollment.course.title,
      slug: enrollment.course.slug,
      progress: enrollment.progress,
      image: enrollment.course.thumbnail,
      instructor: enrollment.course.instructor.name,
      lastAccessed: enrollment.last_accessed,
      course: {
        duration: enrollment.course.duration,
      },
    }));

    return NextResponse.json(transformedEnrollments);
  } catch (error) {
    console.error("Error in enrollments endpoint:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
