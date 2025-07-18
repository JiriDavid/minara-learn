import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Await cookie store retrieval to properly handle async behavior
    const cookieStore = await cookies(); // await here

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value || null; // Ensure null if not found
          },
          set(name, value, options) {
            cookieStore.set(name, value, options);
          },
          remove(name, options) {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, message: authError.message + " This is the error" },
        { status: 401 }
      );
    }

    // Get user profile from profiles table
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      // If no profile exists, log the issue but don't fail the login
      console.log("Profile not found for user:", authData.user.id);
      console.log("Profile will be created automatically by auth context");
      
      // Return user data without profile for now
      // The auth context will handle profile creation
      return NextResponse.json({
        success: true,
        data: {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'User',
          role: authData.user.user_metadata?.role || 'student',
          image: authData.user.user_metadata?.avatar_url || null,
        },
        note: "Profile will be created automatically"
      });
    }

    // Return user data with role
    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        email: authData.user.email,
        name: profile.name, // Use name from schema
        role: profile.role,
        image: profile.avatar_url,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
