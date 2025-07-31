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
      options: {
        data: {
          full_name: name,
          role: role,
        },
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { success: false, message: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, message: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Always try to create/update the profile to ensure it exists
    const profileData = {
      id: authData.user.id,
      email,
      full_name: name,
      role,
      avatar_url: null,
      bio: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Creating/updating profile with data:', profileData);

    // Try multiple approaches to ensure profile creation works
    let profileCreated = false;
    let profileError = null;

    // Small delay to ensure auth user is fully committed
    await new Promise(resolve => setTimeout(resolve, 100));

    // Method 1: Try upsert first
    try {
      const { data: profileResult, error: upsertError } = await supabase
        .from("profiles")
        .upsert([profileData], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select();

      if (!upsertError && profileResult) {
        console.log('Profile upserted successfully:', profileResult);
        profileCreated = true;
      } else {
        throw upsertError || new Error('Upsert returned no data');
      }
    } catch (upsertErr) {
      console.log('Upsert failed, trying insert:', upsertErr);
      
      // Method 2: Try simple insert
      try {
        const { data: insertResult, error: insertError } = await supabase
          .from("profiles")
          .insert([profileData])
          .select();

        if (!insertError && insertResult) {
          console.log('Profile inserted successfully:', insertResult);
          profileCreated = true;
        } else {
          throw insertError || new Error('Insert returned no data');
        }
      } catch (insertErr) {
        console.log('Insert failed, checking if profile exists:', insertErr);
        
        // Method 3: Check if profile already exists
        const { data: existingProfile, error: checkError } = await supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .eq("id", authData.user.id)
          .single();

        if (existingProfile && !checkError) {
          console.log('Profile already exists:', existingProfile);
          profileCreated = true;
        } else {
          profileError = insertErr || checkError;
          console.error('All profile creation methods failed:', profileError);
          console.error('Profile creation failed with details:', {
            upsertError: upsertErr?.message || 'No upsert error',
            insertError: insertErr?.message || 'No insert error', 
            checkError: checkError?.message || 'No check error',
            userId: authData.user.id,
            email: email,
            fullName: name
          });
        }
      }
    }

    if (!profileCreated) {
      console.error("Profile creation error:", profileError);
      console.error("Error details:", {
        message: profileError?.message || 'Unknown error',
        details: profileError?.details || 'No details available',
        hint: profileError?.hint || 'No hint available',
        code: profileError?.code || 'No code available'
      });
      
      // Don't delete the user - they can try again or admin can fix the profile
      // await supabase.auth.admin.deleteUser(authData.user.id);
      
      // More specific error messages based on error type
      let errorMessage = "Failed to create user profile";
      if (profileError?.code === '23503') {
        errorMessage = "Database foreign key constraint error. Please run the emergency database fix.";
      } else if (profileError?.code === '42501') {
        errorMessage = "Database permission error. Please run the emergency database fix.";
      } else if (profileError?.message?.includes('RLS')) {
        errorMessage = "Row Level Security blocking profile creation. Please run the database fix.";
      } else if (profileError?.message?.includes('foreign key')) {
        errorMessage = "Foreign key constraint error. Please run the emergency database fix.";
      } else if (profileError?.message) {
        errorMessage = `Profile creation failed: ${profileError.message}`;
      }
      
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        id: authData.user.id,
        email,
        full_name: name,
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
