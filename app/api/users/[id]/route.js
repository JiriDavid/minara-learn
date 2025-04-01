import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

import connectToDB from "@/lib/db";
import User from "@/models/User";

// GET: Get user by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    await connectToDB();

    const user = await User.findById(id).select('-__v');

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH: Update user by ID
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Remove any attempt to update sensitive fields
    const {
      clerkId, // Cannot change the clerk association
      email, // Email is managed by Clerk
      role, // Only admins can change roles (should be handled separately)
      ...updateData
    } = body;
    
    await connectToDB();

    // Find the user and update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE: Delete user by ID (Admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await connectToDB();

    // First, find the user to get their clerkId
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Delete from our database
    await User.findByIdAndDelete(id);
    
    // If the user has a clerkId, also delete from Clerk
    if (user.clerkId) {
      try {
        await clerkClient.users.deleteUser(user.clerkId);
      } catch (clerkError) {
        console.error("Error deleting user from Clerk:", clerkError);
        // Continue with the process even if Clerk deletion fails
      }
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
} 