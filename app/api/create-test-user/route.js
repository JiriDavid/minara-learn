import { createClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createClient()
    
    console.log('Creating test user...')
    
    // Create a test user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      options: {
        data: {
          display_name: 'Test User',
          role: 'student'
        }
      }
    })
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ 
        success: false, 
        error: authError.message 
      })
    }
    
    console.log('Test user created:', authData.user?.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test user created successfully',
      userId: authData.user?.id,
      email: authData.user?.email
    })
  } catch (err) {
    console.error('Error creating test user:', err)
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to create a test user with email: test@example.com and password: testpassword123'
  })
}
