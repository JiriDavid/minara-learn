"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      try {
        if (!user) return;

        // Fetch the user's role from the API
        const response = await fetch("/api/users/me");
        const data = await response.json();

        if (data.success && data.data?.role) {
          // Redirect based on role
          const role = data.data.role;
          console.log('Redirecting user with role:', role);
          
          if (role === 'admin') {
            router.push('/dashboard/admin');
          } else if (role === 'instructor') {
            router.push('/dashboard/instructor');
          } else if (role === 'student') {
            router.push('/dashboard/student');
          } else {
            // Default to student dashboard for unknown roles
            router.push("/dashboard/student");
          }
        } else {
          // Default to student dashboard if role cannot be determined
          router.push("/dashboard/student");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        // Default to student dashboard on error
        router.push("/dashboard/student");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      redirectBasedOnRole();
    }
  }, [user, authLoading, router]);

  // Show loading state while determining where to redirect
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
    </div>
  );
}
