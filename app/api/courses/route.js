import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase";

// GET: Get all courses with filtering and pagination
export async function GET(request) {
  try {
    const supabase = getServerSupabaseClient();

    // Get URL search params (for pagination, filtering, etc.)
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Calculate pagination
    const startIndex = (page - 1) * limit;

    // Start query builder
    let query = supabase.from("courses").select(`
        *,
        instructor:profiles(id, full_name, email),
        sections:sections(id, title, order)
      `);

    // Add filters if provided
    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%, description.ilike.%${search}%`
      );
    }

    // Add pagination
    const {
      data: courses,
      error,
      count,
    } = await query
      .order("created_at", { ascending: false })
      .range(startIndex, startIndex + limit - 1)
      .limit(limit);

    if (error) {
      throw error;
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("courses")
      .select("*", { count: "exact" });

    if (countError) {
      throw countError;
    }

    return NextResponse.json({
      courses,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCourses: totalCount,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
