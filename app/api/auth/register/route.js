import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["student", "instructor", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    // ✅ Await cookies() here
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: async (name) => {
            const value = await cookieStore.get(name);
            return value?.value;
          },
          set: async (name, value, options) => {
            await cookieStore.set(name, value, options);
          },
          remove: async (name, options) => {
            await cookieStore.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, message: authError.message },
        { status: 400 }
      );
    }

    // Create profile in profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      name: name, // Use name field
      role,
      avatar_url: null,
      bio: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      // Clean up if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { success: false, message: "Failed to create user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        id: authData.user.id,
        email,
        name,
        role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
