import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Apply RLS policies and trigger
    const sqlCommands = [
      // Add missing RLS policies for profiles table
      `CREATE POLICY IF NOT EXISTS "Users can insert their own profile" 
       ON profiles FOR INSERT 
       WITH CHECK (auth.uid() = id);`,
      
      `CREATE POLICY IF NOT EXISTS "Users can update their own profile" 
       ON profiles FOR UPDATE 
       USING (auth.uid() = id)
       WITH CHECK (auth.uid() = id);`,
      
      `CREATE POLICY IF NOT EXISTS "Users can delete their own profile" 
       ON profiles FOR DELETE 
       USING (auth.uid() = id);`,
      
      // Function to handle user profile creation
      `CREATE OR REPLACE FUNCTION public.handle_new_user()
       RETURNS TRIGGER AS $$
       BEGIN
         INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
         VALUES (
           NEW.id,
           NEW.email,
           COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
           COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
           NOW(),
           NOW()
         );
         RETURN NEW;
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`,
      
      // Trigger to automatically create profile when user signs up
      `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`,
      `CREATE TRIGGER on_auth_user_created
         AFTER INSERT ON auth.users
         FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`
    ];
    
    const results = [];
    
    for (const sql of sqlCommands) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql });
        if (error) {
          console.error('SQL Error:', error);
          results.push({ sql: sql.substring(0, 50) + '...', error: error.message });
        } else {
          results.push({ sql: sql.substring(0, 50) + '...', success: true });
        }
      } catch (err) {
        console.error('Execute Error:', err);
        results.push({ sql: sql.substring(0, 50) + '...', error: err.message });
      }
    }
    
    return NextResponse.json({
      message: "RLS policies and trigger setup attempted",
      results
    });
    
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check current policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'profiles');
    
    // Check if trigger exists
    const { data: triggers, error: triggersError } = await supabase
      .from('pg_trigger')
      .select('*')
      .eq('tgname', 'on_auth_user_created');
    
    return NextResponse.json({
      policies: policies || [],
      policiesError: policiesError?.message,
      triggers: triggers || [],
      triggersError: triggersError?.message
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
