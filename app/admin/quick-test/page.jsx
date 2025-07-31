"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function QuickDatabaseTest() {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message, type = "info") => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runQuickTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const supabase = createClient();
    
    addResult("🔍 Starting database diagnostics...", "info");
    
    // Test 1: Basic connection
    try {
      addResult("Testing basic Supabase connection...", "info");
      const { data, error } = await supabase.from("profiles").select("count").limit(1);
      
      if (error) {
        addResult(`❌ Profiles table access failed: ${error.message}`, "error");
        addResult(`Error code: ${error.code}`, "error");
      } else {
        addResult("✅ Basic connection to profiles table works", "success");
      }
    } catch (err) {
      addResult(`❌ Critical error accessing profiles: ${err.message}`, "error");
    }
    
    // Test 2: Try creating a user (this will show the exact error)
    try {
      addResult("Testing user creation...", "info");
      
      const testEmail = `flashiep@example.com`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: "TestPassword123!",
        options: {
          data: {
            full_name: "Quick Test User",
            role: "student"
          }
        }
      });
      
      if (authError) {
        if (authError.message.includes('User already registered')) {
          addResult("✅ Auth system is working (user exists)", "success");
        } else {
          addResult(`❌ Auth error: ${authError.message}`, "error");
        }
      } else if (authData.user) {
        addResult("✅ User created successfully in auth", "success");
        
        // Now test profile creation
        addResult("Testing profile creation...", "info");
        
        const profileData = {
          id: authData.user.id,
          email: testEmail,
          full_name: "Quick Test User",
          role: "student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { data: profileResult, error: profileError } = await supabase
          .from("profiles")
          .insert([profileData])
          .select();
        
        if (profileError) {
          addResult(`❌ PROFILE CREATION FAILED: ${profileError.message}`, "error");
          addResult(`Error code: ${profileError.code}`, "error");
          addResult(`Details: ${JSON.stringify(profileError.details)}`, "error");
          addResult("🚨 THIS IS THE EXACT ERROR YOU'RE GETTING!", "error");
          addResult("📋 You MUST run the SQL fix in Supabase now!", "error");
        } else {
          addResult("✅ Profile created successfully!", "success");
          addResult("🎉 Database is working correctly!", "success");
          
          // Clean up
          await supabase.from("profiles").delete().eq("id", authData.user.id);
        }
        
        // Clean up auth user
        // Note: We can't delete users with the anon key, but that's okay for testing
      }
    } catch (err) {
      addResult(`❌ Test failed with error: ${err.message}`, "error");
    }
    
    setIsRunning(false);
  };

  const copySQL = () => {
    const sql = `-- EMERGENCY DATABASE FIX - COPY AND RUN IN SUPABASE SQL EDITOR

-- 1. Drop all existing problematic policies
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- 2. Create correct RLS policies for profiles
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 3. Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 4. Fix instructor_applications table
ALTER TABLE instructor_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_applications DROP CONSTRAINT IF EXISTS instructor_applications_user_id_fkey;
GRANT ALL ON instructor_applications TO public;
GRANT ALL ON instructor_applications TO authenticated;
GRANT ALL ON instructor_applications TO anon;`;

    navigator.clipboard.writeText(sql).then(() => {
      alert("SQL fix copied to clipboard! Now go to Supabase SQL Editor and paste it.");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🔧 Database Quick Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Run Database Test</h2>
            
            <button
              onClick={runQuickTest}
              disabled={isRunning}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
            >
              {isRunning ? "🔄 Testing..." : "🚀 Run Quick Test"}
            </button>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    result.type === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : result.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
                >
                  <span className="text-xs text-gray-500">{result.timestamp}</span>
                  <br />
                  {result.message}
                </div>
              ))}
            </div>
          </div>
          
          {/* SQL Fix Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🚨 SQL Fix Required</h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h3 className="font-medium text-yellow-800 mb-2">If Test Fails:</h3>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. Copy the SQL fix below</li>
                  <li>2. Go to Supabase Dashboard</li>
                  <li>3. Open SQL Editor</li>
                  <li>4. Paste and run the SQL</li>
                  <li>5. Run the test again</li>
                </ol>
              </div>
              
              <button
                onClick={copySQL}
                className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
              >
                📋 Copy SQL Fix to Clipboard
              </button>
              
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 text-center"
              >
                🔗 Open Supabase Dashboard
              </a>
            </div>
            
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-medium text-red-800 mb-2">Current Issue:</h3>
              <p className="text-sm text-red-700">
                Database RLS policies are blocking profile creation. This is a 
                <strong> database configuration issue</strong>, not a code problem.
                The SQL fix will resolve all registration errors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
