import { createClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    
    const supabase = createClient()
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Connection test failed:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error 
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working!',
      data 
    })
  } catch (err) {
    console.error('Connection test error:', err)
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    })
  }
}
