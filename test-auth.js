// Simple test to check auth functionality
import { createClient } from './utils/supabase/client.js';

async function testAuth() {
  const supabase = createClient();
  
  console.log('Testing Supabase client...');
  
  // Test 1: Try to get session
  try {
    const { data: session, error } = await supabase.auth.getSession();
    console.log('Session test:', { session: !!session, error: error?.message });
  } catch (err) {
    console.error('Session error:', err);
  }
  
  // Test 2: Try to sign up with a test user
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      options: {
        data: {
          name: 'Test User',
          role: 'student'
        }
      }
    });
    console.log('Signup test:', { data: !!data, error: error?.message });
  } catch (err) {
    console.error('Signup error:', err);
  }
}

testAuth();
