import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";
import User from "@/models/User";

// PATCH: Update user role (Admin only)
export async function PATCH(request) {
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
        { message: "Forbidden: Only admins can change user roles" },
        { status: 403 }
      );
    }

    // Get the target user and role from request body
    const { userId: targetUserId, role } = await request.json();

    if (!targetUserId || !role) {
      return NextResponse.json(
        { message: "User ID and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["student", "lecturer", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: "Invalid role. Must be student, lecturer, or admin" },
        { status: 400 }
      );
    }

    // Find the user by ID and update the role
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { role },
      { new: true, runValidators: true }
    ).select("name email role");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { message: "Failed to update user role" },
      { status: 500 }
    );
  }
}
