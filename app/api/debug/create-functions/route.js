import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  try {
    const { password } = await req.json();
    
    // Simple password check for security
    if (password !== 'create-functions-2025') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = await createClient();

    console.log("Creating database functions for profile management...");

    // Create function to insert profiles (bypasses RLS when called from trusted context)
    const createProfileFunction = `
      CREATE OR REPLACE FUNCTION create_user_profile(
        user_id UUID,
        user_name TEXT,
        user_email TEXT,
        user_role TEXT DEFAULT 'student'
      )
      RETURNS VOID AS $$
      BEGIN
        INSERT INTO profiles (id, name, email, role, created_at, updated_at)
        VALUES (user_id, user_name, user_email, user_role, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          role = EXCLUDED.role,
          updated_at = NOW();
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    console.log("Executing create_user_profile function...");
    const { error: functionError } = await supabase.rpc('exec_sql', { 
      query: createProfileFunction 
    });

    if (functionError) {
      console.error("Function creation error:", functionError);
    }

    // Also create a trigger function for automatic profile creation
    const triggerFunction = `
      CREATE OR REPLACE FUNCTION public.handle_new_user() 
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
        VALUES (
          NEW.id, 
          COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
          NEW.email, 
          COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    console.log("Executing trigger function...");
    const { error: triggerError } = await supabase.rpc('exec_sql', { 
      query: triggerFunction 
    });

    if (triggerError) {
      console.error("Trigger function error:", triggerError);
    }

    // Create the trigger
    const createTrigger = `
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;

    console.log("Creating trigger...");
    const { error: triggerCreateError } = await supabase.rpc('exec_sql', { 
      query: createTrigger 
    });

    if (triggerCreateError) {
      console.error("Trigger creation error:", triggerCreateError);
    }

    return NextResponse.json({ 
      message: 'Database functions created',
      functionError: functionError?.message || null,
      triggerError: triggerError?.message || null,
      triggerCreateError: triggerCreateError?.message || null,
      success: !functionError && !triggerError && !triggerCreateError
    });
    
  } catch (error) {
    console.error('Function creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create functions', details: error.message },
      { status: 500 }
    );
  }
}
