// Test auth flow with fetch
async function testSignUp() {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123',
        role: 'student'
      })
    });

    const data = await response.json();
    console.log('API Response:', data);
    
    if (response.ok) {
      console.log('✅ API signup successful');
    } else {
      console.log('❌ API signup failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Test the client-side auth
async function testClientAuth() {
  try {
    const { createClient } = await import('./utils/supabase/client.js');
    const supabase = createClient();
    
    console.log('Testing client-side auth...');
    
    const { data, error } = await supabase.auth.signUp({
      email: 'test2@example.com',
      password: 'testpassword123',
      options: {
        data: {
          full_name: 'Test User 2',
          role: 'student'
        }
      }
    });
    
    if (error) {
      console.log('❌ Client signup failed:', error.message);
    } else {
      console.log('✅ Client signup successful:', data);
    }
    
  } catch (error) {
    console.error('❌ Client auth error:', error);
  }
}

console.log('=== Testing Authentication ===');
testSignUp();
testClientAuth();
