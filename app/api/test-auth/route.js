import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test database connection
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .limit(5);
    
    return NextResponse.json({
      message: "Auth test endpoint",
      profiles: profiles || [],
      profilesError: profilesError?.message || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;
    
    const supabase = await createClient();
    
    // Test signup
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation for testing
      user_metadata: {
        name: name,
        role: 'student'
      }
    });
    
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
    
    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([{
        id: authData.user.id,
        email,
        name: name,
        role: 'student'
      }])
      .select()
      .single();
    
    if (profileError) {
      return NextResponse.json({ 
        error: "Profile creation failed", 
        details: profileError.message 
      }, { status: 400 });
    }

    return NextResponse.json({
      message: "User created successfully",
      user: authData.user,
      profile: profileData
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
