"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function AuthTestPage() {
  const { user, profile, role, loading, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        setDebugInfo(data);
      } catch (error) {
        setDebugInfo({ error: error.message });
      }
    };

    if (user) {
      fetchDebugInfo();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🔍 Auth State Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Context State */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Auth Context State</h2>
            
            <div className="space-y-3">
              <div className={`p-3 rounded ${loading ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                <strong>Loading:</strong> {loading ? '⏳ Yes' : '✅ No'}
              </div>
              
              <div className={`p-3 rounded ${isAuthenticated ? 'bg-green-50' : 'bg-red-50'}`}>
                <strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>User ID:</strong> {user?.id || 'None'}
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>User Email:</strong> {user?.email || 'None'}
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Role:</strong> {role || 'None'}
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Profile:</strong> 
                <pre className="text-xs mt-1 overflow-auto">
                  {profile ? JSON.stringify(profile, null, 2) : 'None'}
                </pre>
              </div>
            </div>
          </div>
          
          {/* API Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API Response (/api/users/me)</h2>
            
            <div className="p-3 bg-gray-50 rounded">
              <pre className="text-xs overflow-auto">
                {debugInfo ? JSON.stringify(debugInfo, null, 2) : 'Loading...'}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <div className="flex flex-wrap gap-3">
            <a 
              href="/auth/signin" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Sign In
            </a>
            <a 
              href="/dashboard" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Go to Dashboard
            </a>
            <a 
              href="/auth/signup/student" 
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Register New User
            </a>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-medium text-yellow-800 mb-2">Expected Behavior:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• After login: isAuthenticated should be true</li>
            <li>• Role should match the user's registered role</li>
            <li>• Profile should contain user data</li>
            <li>• API response should show success: true</li>
            <li>• Dashboard redirect should work smoothly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
