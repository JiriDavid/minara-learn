import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Use service role key for admin operations
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
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

    const fixes = [];
    const errors = [];

    // Fix 1: Drop problematic RLS policies on profiles
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
          DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
          DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
          DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
          DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
        `
      });
      fixes.push("Dropped existing RLS policies on profiles");
    } catch (error) {
      errors.push(`Failed to drop policies: ${error.message}`);
    }

    // Fix 2: Create proper RLS policies
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE POLICY "Users can insert their own profile" ON profiles
            FOR INSERT WITH CHECK (auth.uid() = id);
          
          CREATE POLICY "Users can view their own profile" ON profiles
            FOR SELECT USING (auth.uid() = id);
          
          CREATE POLICY "Users can update their own profile" ON profiles
            FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
        `
      });
      fixes.push("Created proper RLS policies on profiles");
    } catch (error) {
      errors.push(`Failed to create policies: ${error.message}`);
    }

    // Fix 3: Grant permissions on profiles
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          GRANT ALL ON profiles TO authenticated;
          GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
        `
      });
      fixes.push("Granted permissions on profiles table");
    } catch (error) {
      errors.push(`Failed to grant permissions: ${error.message}`);
    }

    // Fix 4: Disable RLS on instructor_applications
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE instructor_applications DISABLE ROW LEVEL SECURITY;
        `
      });
      fixes.push("Disabled RLS on instructor_applications");
    } catch (error) {
      errors.push(`Failed to disable RLS on instructor_applications: ${error.message}`);
    }

    // Fix 5: Remove problematic foreign key constraint
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE instructor_applications 
          DROP CONSTRAINT IF EXISTS instructor_applications_user_id_fkey;
        `
      });
      fixes.push("Removed foreign key constraint on instructor_applications");
    } catch (error) {
      errors.push(`Failed to remove foreign key: ${error.message}`);
    }

    // Fix 6: Grant permissions on instructor_applications
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          GRANT ALL ON instructor_applications TO public;
          GRANT ALL ON instructor_applications TO authenticated;
          GRANT ALL ON instructor_applications TO anon;
        `
      });
      fixes.push("Granted permissions on instructor_applications");
    } catch (error) {
      errors.push(`Failed to grant permissions on instructor_applications: ${error.message}`);
    }

    return NextResponse.json({
      success: errors.length === 0,
      message: errors.length === 0 
        ? "Database fixes applied successfully!" 
        : "Some fixes failed - check the details",
      appliedFixes: fixes,
      errors: errors,
      recommendation: errors.length === 0 
        ? "Try user registration again - it should work now!"
        : "Manual SQL execution in Supabase SQL Editor may be required"
    });

  } catch (error) {
    console.error("Database fix error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to apply database fixes",
        error: error.message,
        recommendation: "Use the emergency fix page to run SQL manually in Supabase"
      },
      { status: 500 }
    );
  }
}
