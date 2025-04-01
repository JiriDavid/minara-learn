import { NextResponse } from "next/server";
import connectToDB from "@/lib/db/mongoose";
import Course from "@/models/Course";
import User from "@/models/User";

// GET: Get all courses with filtering and pagination
export async function GET(request) {
  try {
    const url = new URL(request.url);

    // Parse query parameters
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 9;
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category");
    const level = url.searchParams.get("level");
    const sort = url.searchParams.get("sort") || "newest";

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build the query
    const query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Additional filters can be added here

    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
        sortOptions = { numStudents: -1 };
        break;
      case "price-high":
        sortOptions = { price: -1 };
        break;
      case "price-low":
        sortOptions = { price: 1 };
        break;
      case "rating":
        sortOptions = { ratings: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    await connectToDB();

    // Get total courses count (for pagination)
    const totalCourses = await Course.countDocuments(query);

    // Get courses with pagination and sorting
    const courses = await Course.find(query)
      .select(
        "title slug description thumbnail price discount ratings numReviews duration level category lecturer createdAt"
      )
      .populate({
        path: "lecturer",
        select: "name image",
        model: User,
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalCourses / limit);

    // Get all categories for filters
    const categories = await Course.distinct("category");

    // Get all levels for filters
    const levels = await Course.distinct("level");

    return NextResponse.json(
      {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses,
          hasMore: page < totalPages,
        },
        filters: {
          categories,
          levels,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
