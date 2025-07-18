// Test script to verify student dashboard functionality
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStudentDashboard() {
  console.log('🧪 Testing Student Dashboard Functionality...\n')
  
  try {
    // Test 1: Check if we can fetch courses
    console.log('1. Testing courses API...')
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .limit(5)
    
    if (coursesError) {
      console.error('❌ Courses API error:', coursesError.message)
    } else {
      console.log(`✅ Found ${courses.length} published courses`)
    }
    
    // Test 2: Check if we can fetch enrollments (without user context)
    console.log('\n2. Testing enrollments structure...')
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id,
        status,
        progress,
        enrollment_date,
        course:courses(title, slug),
        user:profiles(name, email)
      `)
      .limit(3)
    
    if (enrollmentsError) {
      console.error('❌ Enrollments API error:', enrollmentsError.message)
    } else {
      console.log(`✅ Enrollments structure test passed (${enrollments.length} records)`)
    }
    
    // Test 3: Check profiles table structure
    console.log('\n3. Testing profiles structure...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .eq('role', 'student')
      .limit(3)
    
    if (profilesError) {
      console.error('❌ Profiles API error:', profilesError.message)
    } else {
      console.log(`✅ Found ${profiles.length} student profiles`)
      if (profiles.length > 0) {
        console.log('   Sample profile fields:', Object.keys(profiles[0]))
      }
    }
    
    console.log('\n🎉 Dashboard API tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  testStudentDashboard().catch(console.error)
}

export default testStudentDashboard
