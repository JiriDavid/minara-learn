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

    // For now, return placeholder achievements based on user's progress
    // In the future, this would be stored in an achievements/badges table
    const achievements = [];

    // Get user's enrollments to generate achievements
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("progress, created_at")
      .eq("user_id", user.id);

    if (enrollments && enrollments.length > 0) {
      // First Course Achievement
      if (enrollments.length >= 1) {
        achievements.push({
          id: "first_course",
          title: "Getting Started",
          description: "Enrolled in your first course",
          date: enrollments[0].created_at,
          icon: "play",
        });
      }

      // Progress achievements
      const highProgress = enrollments.filter(e => e.progress >= 50);
      if (highProgress.length > 0) {
        achievements.push({
          id: "half_way",
          title: "Half Way There",
          description: "Reached 50% progress in a course",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          icon: "trending-up",
        });
      }

      // Completion achievements
      const completed = enrollments.filter(e => e.progress >= 100);
      if (completed.length > 0) {
        achievements.push({
          id: "first_completion",
          title: "Course Completed",
          description: "Completed your first course",
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          icon: "check",
        });
      }

      // Multiple enrollments
      if (enrollments.length >= 3) {
        achievements.push({
          id: "eager_learner",
          title: "Eager Learner",
          description: "Enrolled in 3 or more courses",
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          icon: "book",
        });
      }
    }

    // Sort achievements by date (most recent first)
    achievements.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error in achievements endpoint:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
