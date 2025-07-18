import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  try {
    const { password } = await req.json();
    
    // Simple password check for security
    if (password !== 'fix-rls-2025') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = await createClient();

    console.log("Attempting to fix RLS policies for profiles table...");

    // The SQL commands to fix the RLS issue
    const commands = [
      // Drop existing policies that might conflict
      `DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;`,
      
      // Create the INSERT policy
      `CREATE POLICY "Users can insert their own profile" 
       ON profiles FOR INSERT 
       WITH CHECK (auth.uid() = id);`,
       
      // Create admin policy 
      `CREATE POLICY "Admins can manage all profiles" 
       ON profiles FOR ALL 
       USING (
         EXISTS (
           SELECT 1 FROM profiles 
           WHERE id = auth.uid() AND role = 'admin'
         )
       );`,
       
      // Create a function to handle new user signup
      `CREATE OR REPLACE FUNCTION public.handle_new_user() 
       RETURNS trigger AS $$
       BEGIN
         INSERT INTO public.profiles (id, name, email, role)
         VALUES (new.id, new.raw_user_meta_data->>'name', new.email, COALESCE(new.raw_user_meta_data->>'role', 'student'));
         RETURN new;
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`,
       
      // Create trigger
      `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`,
      
      `CREATE TRIGGER on_auth_user_created
       AFTER INSERT ON auth.users
       FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`
    ];

    const results = [];
    
    for (const command of commands) {
      try {
        console.log("Executing:", command.substring(0, 50) + "...");
        const result = await supabase.rpc('exec_sql', { query: command });
        results.push({ 
          command: command.substring(0, 100),
          success: !result.error,
          error: result.error?.message || null
        });
      } catch (error) {
        console.error("Error executing command:", error);
        results.push({ 
          command: command.substring(0, 100),
          success: false,
          error: error.message
        });
      }
    }

    return NextResponse.json({ 
      message: 'RLS fix attempted',
      results
    });
    
  } catch (error) {
    console.error('RLS fix error:', error);
    return NextResponse.json(
      { error: 'Failed to fix RLS', details: error.message },
      { status: 500 }
    );
  }
}
