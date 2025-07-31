"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, role, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!user) {
      console.log('No user found, redirecting to signin');
      router.push('/auth/signin');
      return;
    }

    // Use role from auth context instead of API call
    if (role) {
      console.log('Redirecting user with role:', role);
      
      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else if (role === 'instructor' || role === 'instructor_pending') {
        router.push('/dashboard/instructor');
      } else if (role === 'student') {
        router.push('/dashboard/student');
      } else {
        // Default to student dashboard for unknown roles
        router.push("/dashboard/student");
      }
    } else if (profile === null && user) {
      // Profile is explicitly null, but user exists - profile might be missing
      console.log('User exists but no profile found, defaulting to student dashboard');
      router.push("/dashboard/student");
    }
    
    setIsLoading(false);
  }, [authLoading, user, role, profile, router]);

  // Show loading state while determining where to redirect
  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  // This should not render since we redirect above, but just in case
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
