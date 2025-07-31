'use client'

import { useState } from 'react'

export default function SetupDatabasePage() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const setupInstructorTable = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/setup-instructor-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Request failed', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  const checkInstructorTable = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-instructor-applications')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Request failed', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  const fixRLSPolicies = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/fix-instructor-rls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'RLS fix failed', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  const debugRLS = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/instructor-rls')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Debug failed', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Setup Tools</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Instructor Applications Table Setup</h2>
          <p className="text-gray-600 mb-4">
            Use these tools to create and fix the instructor_applications table and its permissions.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={setupInstructorTable}
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Setup Table'}
            </button>
            
            <button
              onClick={checkInstructorTable}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Table'}
            </button>

            <button
              onClick={fixRLSPolicies}
              disabled={loading}
              className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Fixing...' : 'Fix RLS Policies'}
            </button>

            <button
              onClick={debugRLS}
              disabled={loading}
              className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Debugging...' : 'Debug RLS'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
            
            {result.error && result.note && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-semibold text-yellow-800">Manual Setup Required:</h4>
                <p className="text-yellow-700 mt-1">
                  If the automatic setup failed, please:
                </p>
                <ol className="list-decimal list-inside text-yellow-700 mt-2 space-y-1">
                  <li>Go to your Supabase dashboard</li>
                  <li>Open the SQL Editor</li>
                  <li>Run the SQL script from: <code>scripts/fix-instructor-rls.sql</code></li>
                  <li>Then test the instructor application again</li>
                </ol>
              </div>
            )}

            {result.error && result.code === '42P01' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <h4 className="font-semibold text-red-800">Table Missing:</h4>
                <p className="text-red-700 mt-1">
                  The instructor_applications table doesn't exist. Click "Setup Table" first.
                </p>
              </div>
            )}

            {result.insertTest?.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <h4 className="font-semibold text-red-800">RLS Policy Issue:</h4>
                <p className="text-red-700 mt-1">
                  Insert test failed: {result.insertTest.error}
                </p>
                <p className="text-red-700 mt-1">
                  Click "Fix RLS Policies" to resolve this issue.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-800">Quick Fix for RLS Error:</h4>
          <ol className="list-decimal list-inside text-blue-700 mt-2 space-y-1">
            <li>Make sure you're logged in as an admin user</li>
            <li>Click "Debug RLS" to see what's wrong</li>
            <li>Click "Fix RLS Policies" to automatically fix permission issues</li>
            <li>If that fails, manually run <code>scripts/fix-instructor-rls.sql</code> in Supabase</li>
            <li>Then test the instructor application form again</li>
          </ol>
          
          <div className="mt-3 p-2 bg-blue-100 rounded">
            <p className="text-sm text-blue-800">
              <strong>Error you're seeing:</strong> "new row violates row-level security policy for table instructor_applications"
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Solution:</strong> The RLS policies need to be fixed to allow users to insert their own applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
