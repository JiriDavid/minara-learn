import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated (basic check)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Attempting to fix RLS policies...");

    // Step 1: Add INSERT policy for profiles
    const insertPolicySQL = `
      CREATE POLICY "Users can insert their own profile" 
      ON profiles FOR INSERT 
      WITH CHECK (auth.uid() = id);
    `;

    console.log("Executing INSERT policy...");
    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql: insertPolicySQL
    });

    if (insertError) {
      console.error("Insert policy error:", insertError);
    }

    // Step 2: Add admin policy
    const adminPolicySQL = `
      CREATE POLICY "Admins can manage all profiles" 
      ON profiles FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
    `;

    console.log("Executing admin policy...");
    const { error: adminError } = await supabase.rpc('exec_sql', {
      sql: adminPolicySQL
    });

    if (adminError) {
      console.error("Admin policy error:", adminError);
    }

    return NextResponse.json({ 
      message: 'RLS policies updated',
      insertPolicyError: insertError?.message || null,
      adminPolicyError: adminError?.message || null
    });
    
  } catch (error) {
    console.error('Fix RLS error:', error);
    return NextResponse.json(
      { error: 'Failed to fix RLS policies', details: error.message },
      { status: 500 }
    );
  }
}
