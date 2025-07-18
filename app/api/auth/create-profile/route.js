import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json({ 
        message: "Profile already exists",
        profileId: existingProfile.id 
      });
    }

    // Extract user info from auth metadata
    const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const role = user.user_metadata?.role || 'student';

    // Try to create profile
    // Since we can't bypass RLS easily, we'll try a few approaches

    console.log("Attempting to create profile for user:", user.id);

    // Approach 1: Direct insert (might work if policies are fixed)
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          name: name,
          email: user.email,
          role: role,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Direct insert failed:", insertError.message);
      
      // Approach 2: Try using an upsert instead
      const { data: upsertProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: user.id,
            name: name,
            email: user.email,
            role: role,
          },
        ])
        .select()
        .single();

      if (upsertError) {
        console.error("Upsert failed:", upsertError.message);
        return NextResponse.json(
          { 
            error: "Failed to create profile", 
            details: upsertError.message,
            suggestion: "The database may need RLS policies updated. Contact admin."
          },
          { status: 500 }
        );
      } else {
        return NextResponse.json({ 
          message: "Profile created successfully via upsert",
          profile: upsertProfile 
        });
      }
    } else {
      return NextResponse.json({ 
        message: "Profile created successfully",
        profile: newProfile 
      });
    }

  } catch (error) {
    console.error('Create profile error:', error);
    return NextResponse.json(
      { error: 'Failed to create profile', details: error.message },
      { status: 500 }
    );
  }
}
