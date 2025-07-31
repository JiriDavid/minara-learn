import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
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

    // Fix RLS policies for instructor_applications
    const fixRLSSQL = `
      -- Drop existing policies that might be causing issues
      DROP POLICY IF EXISTS "Users can view own applications" ON instructor_applications;
      DROP POLICY IF EXISTS "Users can insert own applications" ON instructor_applications;
      DROP POLICY IF EXISTS "Users can view their own applications" ON instructor_applications;
      DROP POLICY IF EXISTS "Users can insert their own applications" ON instructor_applications;
      
      -- Create correct policies with proper names
      CREATE POLICY "instructor_applications_select_own" 
      ON instructor_applications FOR SELECT 
      TO authenticated 
      USING (auth.uid() = user_id);

      CREATE POLICY "instructor_applications_insert_own" 
      ON instructor_applications FOR INSERT 
      TO authenticated 
      WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "instructor_applications_admin_all" 
      ON instructor_applications FOR ALL 
      TO authenticated 
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND profiles.role = 'admin'
        )
      );
    `

    // Execute the SQL to fix RLS policies
    const { error: sqlError } = await supabase.rpc('exec_sql', { 
      sql: fixRLSSQL 
    })

    if (sqlError) {
      console.error('SQL execution error:', sqlError)
      return NextResponse.json({ 
        error: 'Failed to fix RLS policies', 
        details: sqlError.message,
        sql: fixRLSSQL
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'RLS policies fixed successfully!' 
    })

  } catch (error) {
    console.error('Fix RLS error:', error)
    return NextResponse.json({ 
      error: 'Failed to fix RLS', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to fix instructor applications RLS policies',
    instructions: [
      '1. Make sure you are logged in as an admin',
      '2. Send a POST request to this endpoint to fix RLS policies',
      '3. This will create proper RLS policies for instructor applications'
    ]
  })
}
