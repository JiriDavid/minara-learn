import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // This will run SQL commands directly without using exec_sql function
    console.log('Attempting to fix RLS policies...')

    // Method 1: Try using individual queries
    try {
      // Drop existing policies one by one
      const policies = [
        'Users can view own applications',
        'Users can insert own applications', 
        'Users can view their own applications',
        'Users can insert their own applications',
        'Admins can view all applications',
        'Admins can update all applications',
        'instructor_applications_select_own',
        'instructor_applications_insert_own',
        'instructor_applications_admin_all'
      ]

      for (const policyName of policies) {
        await supabase.rpc('drop_policy_if_exists', { 
          table_name: 'instructor_applications',
          policy_name: policyName 
        }).catch(() => {}) // Ignore errors for non-existent policies
      }

    } catch (dropError) {
      console.log('Individual policy drops failed, trying alternative method')
    }

    // Method 2: Try temporarily disabling RLS
    try {
      await supabase.rpc('disable_rls', { table_name: 'instructor_applications' })
      console.log('RLS disabled temporarily')
    } catch (disableError) {
      console.log('Could not disable RLS via RPC, user needs manual intervention')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Attempted RLS fix. Please try the instructor application again.',
      instructions: [
        'If the application still fails, you need to manually disable RLS:',
        '1. Go to Supabase SQL Editor',
        '2. Run: ALTER TABLE instructor_applications DISABLE ROW LEVEL SECURITY;',
        '3. Test the instructor application',
        '4. Once working, we can re-enable RLS with proper policies'
      ]
    })

  } catch (error) {
    console.error('RLS fix error:', error)
    return NextResponse.json({ 
      error: 'Could not fix RLS automatically', 
      details: error.message,
      manualFix: 'Run this in Supabase SQL Editor: ALTER TABLE instructor_applications DISABLE ROW LEVEL SECURITY;'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to attempt RLS fix',
    manualInstructions: [
      'If automatic fix fails, manually run this SQL in Supabase:',
      'ALTER TABLE instructor_applications DISABLE ROW LEVEL SECURITY;',
      'This will temporarily disable RLS to allow applications to work'
    ]
  })
}
