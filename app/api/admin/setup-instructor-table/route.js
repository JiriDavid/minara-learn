import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated and is admin
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

    // Create the instructor_applications table with correct schema
    const createTableSQL = `
      -- Drop existing table if it exists
      DROP TABLE IF EXISTS instructor_applications CASCADE;

      -- Create the table with correct structure
      CREATE TABLE instructor_applications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
      );

      -- Enable Row Level Security
      ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view own applications" 
      ON instructor_applications FOR SELECT 
      TO authenticated 
      USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own applications" 
      ON instructor_applications FOR INSERT 
      TO authenticated 
      WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Admins can view all applications" 
      ON instructor_applications FOR SELECT 
      TO authenticated 
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND profiles.role = 'admin'
        )
      );

      CREATE POLICY "Admins can update all applications" 
      ON instructor_applications FOR UPDATE 
      TO authenticated 
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND profiles.role = 'admin'
        )
      );

      -- Create indexes
      CREATE INDEX idx_instructor_applications_user_id ON instructor_applications(user_id);
      CREATE INDEX idx_instructor_applications_status ON instructor_applications(status);
      CREATE INDEX idx_instructor_applications_submitted_at ON instructor_applications(submitted_at DESC);
    `

    // Execute the SQL using a raw SQL query
    const { error: sqlError } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    })

    if (sqlError) {
      console.error('SQL execution error:', sqlError)
      return NextResponse.json({ 
        error: 'Failed to create table', 
        details: sqlError.message,
        sql: createTableSQL,
        note: 'You may need to run this SQL manually in your Supabase SQL editor'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Instructor applications table created successfully!' 
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Failed to setup table', 
      details: error.message,
      note: 'Please run the SQL script manually in Supabase'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to create the instructor applications table',
    instructions: [
      '1. Make sure you are logged in as an admin',
      '2. Send a POST request to this endpoint',
      '3. Or manually run the SQL script in your Supabase dashboard',
      '4. The SQL script is available in scripts/SUPABASE_INSTRUCTOR_APPLICATIONS_SETUP.sql'
    ]
  })
}
