'use client'

import { useState } from 'react'

export default function FixRLSPage() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- ===============================================
-- FIX INSTRUCTOR APPLICATIONS RLS POLICIES
-- ===============================================
-- Copy and paste this SQL into your Supabase SQL Editor

-- Step 1: Drop all existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can view own applications" ON instructor_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON instructor_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON instructor_applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON instructor_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON instructor_applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON instructor_applications;
DROP POLICY IF EXISTS "instructor_applications_select_own" ON instructor_applications;
DROP POLICY IF EXISTS "instructor_applications_insert_own" ON instructor_applications;
DROP POLICY IF EXISTS "instructor_applications_admin_all" ON instructor_applications;

-- Step 2: Create simple, working RLS policies
CREATE POLICY "select_own_applications" 
ON instructor_applications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "insert_own_applications" 
ON instructor_applications FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_applications" 
ON instructor_applications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_full_access" 
ON instructor_applications FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Step 3: Verify the policies were created successfully
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'instructor_applications'
ORDER BY policyname;`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const openSupabase = () => {
    window.open('https://supabase.com/dashboard', '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-red-800 mb-4">🚨 RLS Policy Fix Required</h1>
          <p className="text-red-700 mb-4">
            The automatic fix failed because Supabase doesn't allow dynamic SQL execution from API routes.
            You need to run the SQL manually in your Supabase dashboard.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Manual Fix Instructions</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              <span>Copy the SQL script below</span>
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy SQL'}
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              <span>Open your Supabase dashboard</span>
              <button
                onClick={openSupabase}
                className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
              >
                Open Supabase
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
              <span>Go to SQL Editor and paste the script</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
              <span>Run the script to fix RLS policies</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
              <span>Test the instructor application form again</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🔧 SQL Script to Run</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm max-h-96">
            {sqlScript}
          </pre>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-800">What this script does:</h4>
            <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
              <li>Removes all conflicting RLS policies</li>
              <li>Creates clean, simple policies that allow users to manage their own applications</li>
              <li>Allows admins to manage all applications</li>
              <li>Shows you the final policies for verification</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-green-800">After running the script:</h4>
          <p className="text-green-700 mt-1">
            Go back to the instructor signup form and try submitting an application. 
            The RLS error should be resolved!
          </p>
        </div>
      </div>
    </div>
  )
}
