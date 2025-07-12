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

    // Get user's recent activity
    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .select(
        `
        *,
        course:courses(title)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (activitiesError) {
      console.error("Error fetching activities:", activitiesError);
      return new NextResponse("Error fetching activities", { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedActivities = activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      course: activity.course.title,
      detail: activity.detail,
      date: activity.created_at,
    }));

    return NextResponse.json(transformedActivities);
  } catch (error) {
    console.error("Error in activity endpoint:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
