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

    // For now, return empty events array since we don't have an events table yet
    // In the future, this would fetch from a calendar/events table
    const upcomingEvents = [];

    // Placeholder: Generate some example events based on user's enrollments
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`
        course:courses(title, slug)
      `)
      .eq("user_id", user.id)
      .limit(3);

    if (enrollments && enrollments.length > 0) {
      // Generate some placeholder events
      enrollments.forEach((enrollment, index) => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + (index + 1) * 7); // Weekly events

        upcomingEvents.push({
          id: `event_${index + 1}`,
          title: "Live Q&A Session",
          course: enrollment.course.title,
          date: futureDate.toISOString(),
          type: "webinar",
        });
      });
    }

    return NextResponse.json(upcomingEvents);
  } catch (error) {
    console.error("Error in events endpoint:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
