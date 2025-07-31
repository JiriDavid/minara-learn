"use client";

import { createClient } from "@/utils/supabase/client";

export default function DatabaseTestPage() {
  const testProfile = async () => {
    const supabase = createClient();
    
    console.log("Testing database connection...");
    
    // Test 1: Check if we can read from profiles table
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);
      
      console.log("Profiles table read test:", { data, error });
      
      if (error) {
        alert(`Profiles table read failed: ${error.message}`);
        return;
      }
    } catch (err) {
      console.error("Profiles table access error:", err);
      alert(`Cannot access profiles table: ${err.message}`);
      return;
    }
    
    // Test 2: Try to create a test user
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `flashiep@gmail.com`,
        password: "TestPassword123!",
        options: {
          data: {
            full_name: "Test User",
            role: "student"
          }
        }
      });
      
      console.log("Auth signup test:", { authData, authError });
      
      if (authError) {
        alert(`Auth signup failed: ${authError.message}`);
        return;
      }
      
      if (authData.user) {
        // Test 3: Try to create profile
        const profileData = {
          id: authData.user.id,
          email: authData.user.email,
          full_name: "Test User",
          role: "student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        console.log("Attempting profile creation with:", profileData);
        
        const { data: profileResult, error: profileError } = await supabase
          .from("profiles")
          .insert([profileData])
          .select();
        
        console.log("Profile creation test:", { profileResult, profileError });
        
        if (profileError) {
          alert(`Profile creation failed: ${profileError.message}\nCode: ${profileError.code}\nDetails: ${profileError.details}`);
          
          // Clean up the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
        } else {
          alert("✅ Database test PASSED! Registration should work now.");
          
          // Clean up test data
          await supabase.from("profiles").delete().eq("id", authData.user.id);
          await supabase.auth.admin.deleteUser(authData.user.id);
        }
      }
    } catch (err) {
      console.error("Database test error:", err);
      alert(`Database test failed: ${err.message}`);
    }
  };

  const checkRLSPolicies = async () => {
    const supabase = createClient();
    
    try {
      // Try to query the profiles table to see what policies exist
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);
      
      console.log("RLS Policy test:", { data, error });
      
      if (error) {
        alert(`RLS Test failed: ${error.message}\nThis suggests RLS policies are still blocking access.`);
      } else {
        alert("✅ RLS policies seem to be working correctly!");
      }
    } catch (err) {
      console.error("RLS test error:", err);
      alert(`RLS test error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Database Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Database Diagnostics</h2>
          
          <div className="space-y-3">
            <button
              onClick={checkRLSPolicies}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test RLS Policies
            </button>
            
            <button
              onClick={testProfile}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Complete Registration Flow
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-medium text-yellow-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. First click "Test RLS Policies" to check database access</li>
              <li>2. Then click "Test Complete Registration Flow" to simulate user signup</li>
              <li>3. Check the browser console for detailed error logs</li>
              <li>4. If tests fail, you still need to run the SQL fix in Supabase</li>
            </ol>
          </div>
          
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-red-800 mb-2">If Tests Fail:</h3>
            <p className="text-sm text-red-700">
              Go to your Supabase dashboard → SQL Editor → Run the emergency fix SQL command.
              The database configuration is still incorrect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
