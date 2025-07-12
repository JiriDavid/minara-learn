import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServerSupabaseClient();

    // Check courses table
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .limit(10);

    if (coursesError) {
      return NextResponse.json(
        {
          error: "Error fetching courses",
          details: coursesError,
        },
        { status: 500 }
      );
    }

    // Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .limit(10);

    // Check database schema
    const { data: tables, error: tablesError } = await supabase
      .from("pg_catalog.pg_tables")
      .select("tablename")
      .eq("schemaname", "public");

    return NextResponse.json({
      tables: tables || [],
      tablesError,
      courses: courses || [],
      coursesError,
      profiles: profiles || [],
      profilesError,
      env: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
