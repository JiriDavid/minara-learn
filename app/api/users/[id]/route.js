import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Get user by ID
export async function GET(request) {
  const id = new URL(request.url).pathname.split("/").pop();
  console.log("id is :", id);

  const { data: user, error } = await supabase
    .from("profiles") // or "users" depending on your table
    .select("*")
    .eq("id", id)
    .maybeSingle();


  if (error || !user) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ user }, { status: 200 });
}

// PATCH: Update user by ID
export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();

  // Disallow sensitive field updates
  const { id: userId, email, role, ...updateData } = body;

  const { data: updatedUser, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ user: updatedUser }, { status: 200 });
}

// DELETE: Delete user by ID
export async function DELETE(request, { params }) {
  const { uid } = params;

  // First fetch the user to get their Supabase Auth ID
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("uid", uid)
    .single();

  if (fetchError) {
    console.error("Error fetching user:", fetchError);
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Delete user from database
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("uid", uid);

  if (deleteError) {
    console.error("Error deleting user:", deleteError);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }

  // Delete user from Supabase Auth (if auth_id exists)
  if (user.auth_id) {
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
      user.auth_id
    );
    if (authDeleteError) {
      console.error("Error deleting user from Supabase Auth:", authDeleteError);
      // Proceed even if auth deletion fails
    }
  }

  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
}
