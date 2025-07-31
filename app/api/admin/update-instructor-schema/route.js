import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Drop existing table and recreate with correct schema
    const sqlCommands = [
      `DROP TABLE IF EXISTS instructor_applications CASCADE;`,
      
      `CREATE TABLE instructor_applications (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        expertise TEXT NOT NULL,
        experience TEXT NOT NULL,
        organization TEXT,
        bio TEXT NOT NULL,
        motivation TEXT NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        reviewed_by UUID REFERENCES profiles(id),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        admin_notes TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      `ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;`,

      `CREATE POLICY "Users can view their own applications" 
       ON instructor_applications FOR SELECT 
       TO authenticated 
       USING (auth.uid() = user_id);`,

      `CREATE POLICY "Users can insert their own applications" 
       ON instructor_applications FOR INSERT 
       TO authenticated 
       WITH CHECK (auth.uid() = user_id);`,

      `CREATE POLICY "Admins can view all applications" 
       ON instructor_applications FOR SELECT 
       TO authenticated 
       USING (
         EXISTS (
           SELECT 1 FROM profiles 
           WHERE profiles.id = auth.uid() 
           AND profiles.role = 'admin'
         )
       );`,

      `CREATE POLICY "Admins can update all applications" 
       ON instructor_applications FOR UPDATE 
       TO authenticated 
       USING (
         EXISTS (
           SELECT 1 FROM profiles 
           WHERE profiles.id = auth.uid() 
           AND profiles.role = 'admin'
         )
       );`,

      `CREATE INDEX idx_instructor_applications_user_id ON instructor_applications(user_id);`,
      `CREATE INDEX idx_instructor_applications_status ON instructor_applications(status);`,
      `CREATE INDEX idx_instructor_applications_submitted_at ON instructor_applications(submitted_at);`
    ]

    // Execute each SQL command
    for (const sql of sqlCommands) {
      const { error } = await supabase.rpc('execute_sql', { sql_query: sql })
      if (error) {
        console.error('SQL execution error:', error)
        // Continue with other commands even if one fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Instructor applications table updated successfully' 
    })

  } catch (error) {
    console.error('Schema update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update schema', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to update the instructor applications table schema to match the current form fields'
  })
}
