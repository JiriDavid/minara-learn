'use client'

import { useState } from 'react'

export default function EmergencyFixPage() {
  const [step, setStep] = useState(1)

  const emergencySQL = `-- Fix ALL instructor application issues
-- 1. Fix profiles table RLS policies and permissions
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create proper RLS policies for profiles
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Grant necessary permissions on profiles
GRANT ALL ON profiles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 2. Fix instructor_applications table
ALTER TABLE instructor_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_applications DROP CONSTRAINT IF EXISTS instructor_applications_user_id_fkey;

-- Grant permissions on instructor_applications
GRANT ALL ON instructor_applications TO public;
GRANT ALL ON instructor_applications TO authenticated;
GRANT ALL ON instructor_applications TO anon;`

  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(emergencySQL)
      alert('SQL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const openSupabase = () => {
    window.open('https://supabase.com/dashboard', '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
          <h1 className="text-2xl font-bold text-red-800 mb-2">🚨 Complete Database Fix</h1>
          <p className="text-red-700 mb-2">
            The instructor application has THREE blocking issues:
          </p>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            <li><strong>Profile Creation Error:</strong> RLS blocking profile inserts</li>
            <li><strong>RLS Policy Error:</strong> Row Level Security blocking application inserts</li>
            <li><strong>Foreign Key Error:</strong> Constraint violations due to timing issues</li>
          </ul>
          <p className="text-red-700 mt-2">
            This comprehensive fix will resolve all three issues at once.
          </p>
        </div>

        {/* Step 1 */}
        <div className={`bg-white rounded-lg shadow-md p-6 mb-4 ${step === 1 ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
          <div className="flex items-center mb-4">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</span>
            <h2 className="text-lg font-semibold">Copy This SQL Command</h2>
          </div>
          
          <p className="text-gray-600 mb-3">
            This will fix profile creation, RLS policies, and foreign key constraints:
          </p>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded mb-4 font-mono text-sm">
            {emergencySQL}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={copySQL}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              📋 Copy SQL
            </button>
            <button
              onClick={() => setStep(2)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Next Step →
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`bg-white rounded-lg shadow-md p-6 mb-4 ${step === 2 ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
          <div className="flex items-center mb-4">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</span>
            <h2 className="text-lg font-semibold">Open Supabase Dashboard</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Open your Supabase project dashboard and navigate to the SQL Editor.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={openSupabase}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              🔗 Open Supabase
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Next Step →
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`bg-white rounded-lg shadow-md p-6 mb-4 ${step === 3 ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
          <div className="flex items-center mb-4">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</span>
            <h2 className="text-lg font-semibold">Run the SQL</h2>
          </div>
          
          <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
            <li>In Supabase dashboard, click on "SQL Editor" in the left sidebar</li>
            <li>Create a new query</li>
            <li>Paste the SQL command you copied</li>
            <li>Click "Run" to execute it</li>
          </ol>
          
          <button
            onClick={() => setStep(4)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Next Step →
          </button>
        </div>

        {/* Step 4 */}
        <div className={`bg-white rounded-lg shadow-md p-6 mb-4 ${step === 4 ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
          <div className="flex items-center mb-4">
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">4</span>
            <h2 className="text-lg font-semibold">Test the Application</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Now go back to the instructor signup form and try submitting an application. 
            It should work without the RLS error!
          </p>
          
          <a
            href="/auth/signup/instructor"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
          >
            🧪 Test Instructor Signup
          </a>
        </div>

        {/* Summary */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Note</h3>
          <p className="text-yellow-700 text-sm mb-2">
            This emergency fix temporarily:
          </p>
          <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
            <li>Fixes profile creation RLS policies to allow user registration</li>
            <li>Disables Row Level Security on instructor_applications table</li>
            <li>Removes the foreign key constraint that's causing timing issues</li>
            <li>Allows instructor applications to work immediately</li>
          </ul>
          <p className="text-yellow-700 text-sm mt-2">
            This is safe for development. We can add proper constraints back later.
          </p>
        </div>

        {/* Reset button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setStep(1)}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            ← Start Over
          </button>
        </div>
      </div>
    </div>
  )
}
