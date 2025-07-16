import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";
import User from "@/models/User";

// GET: Get all users (Admin only)
export async function GET(request) {
  try {
    const { userId } = auth();

    // If not authenticated
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // Check if the requester is an admin
    const admin = await User.findOne({ clerkId: userId });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Only admins can access all users" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const role = url.searchParams.get("role");
    const search = url.searchParams.get("search");

    // Build query
    const query = {};

    // Filter by role if provided
    if (role && ["student", "lecturer", "admin"].includes(role)) {
      query.role = role;
    }

    // Search by name or email if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get paginated users
    const users = await User.find(query)
      .select("name email role image createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
