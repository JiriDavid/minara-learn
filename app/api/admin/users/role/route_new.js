import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// PATCH: Update user role (Admin only)
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if the requester is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { targetUserId, newRole } = await request.json();

    if (!targetUserId || !newRole) {
      return NextResponse.json(
        { message: "Missing targetUserId or newRole" },
        { status: 400 }
      );
    }

    // Validate the new role
    const validRoles = ['student', 'lecturer', 'admin'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    // Update the user's role
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetUserId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { message: "Error updating user role" },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/users/role:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
