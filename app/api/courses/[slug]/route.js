import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
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

    const { data: course, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        lecturer:profiles(name, avatar_url),
        lessons(*),
        reviews(
          *,
          user:profiles(name, avatar_url)
        )
      `
      )
      .eq("slug", params.slug)
      .single();

    if (error || !course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
