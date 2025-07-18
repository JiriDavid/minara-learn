import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["student", "instructor", "admin"]).default("student"),
});

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate input data
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, role } = result.data;

    const supabase = await createClient();

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (existingUser && !checkError) {
      return NextResponse.json(
        { 
          error: "User already exists", 
          message: "An account with this email address already exists. Please try signing in instead.",
          code: "USER_EXISTS"
        },
        { status: 409 }
      );
    }

    // Sign up the user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role,
        },
      },
    });

    if (authError) {
      // Handle specific error cases
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { 
            error: "User already exists", 
            message: "An account with this email address already exists. Please try signing in instead.",
            code: "USER_EXISTS"
          },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // The profile creation should be handled by a database trigger
    // If that's not working, we'll log the issue but still return success
    // since the user was created in the auth system
    
    console.log("User created in auth system:", authData.user?.id);
    console.log("Profile creation should be handled by database trigger");

    // For instructors, return a different response indicating they need approval
    if (role === 'instructor') {
      return NextResponse.json(
        { 
          message: "Instructor account created successfully", 
          user: {
            id: authData.user?.id,
            email: authData.user?.email,
            name,
            role,
          },
          requiresApproval: true,
          note: "Your instructor account has been created but requires admin approval before you can access the instructor dashboard. You will receive an email once your account is approved."
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          name,
          role,
        },
        requiresApproval: false,
        note: "Profile creation handled by database trigger"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
