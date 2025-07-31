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

    // Get recommended courses based on user's current enrollments and interests
    // For now, get published courses that the user is not enrolled in
    const { data: userEnrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", user.id);

    const enrolledCourseIds = userEnrollments?.map(e => e.course_id) || [];

    let courseQuery = supabase
      .from("courses")
      .select(`
        id,
        title,
        slug,
        thumbnail,
        description,
        level,
        price,
        rating,
        instructor:profiles!instructor_id(name)
      `)
      .eq("status", "published")
      .limit(6);

    // If user has enrollments, exclude those courses
    if (enrolledCourseIds.length > 0) {
      courseQuery = courseQuery.not("id", "in", `(${enrolledCourseIds.join(',')})`);
    }

    const { data: courses, error: coursesError } = await courseQuery;

    if (coursesError) {
      console.error("Error fetching recommended courses:", coursesError);
      return new NextResponse("Error fetching recommendations", { status: 500 });
    }

    // Transform the data to match expected format
    const recommendations = courses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      thumbnail: course.thumbnail || "/images/course-placeholder.jpg",
      description: course.description,
      instructor: course.instructor?.name || "Unknown Instructor",
      rating: course.rating || 4.5,
      reviewCount: Math.floor(Math.random() * 200) + 50, // Placeholder until reviews are implemented
      level: course.level,
      price: course.price,
    }));

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error in recommendations endpoint:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
