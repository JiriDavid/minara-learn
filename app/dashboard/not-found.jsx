"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  Settings,
  AlertTriangle,
  Home,
} from "lucide-react";

export default function DashboardNotFound() {
  const router = useRouter();
  const { user } = useAuth();

  // Determine user role for contextual suggestions
  const getUserRole = () => {
    // This could be enhanced to get the actual user role
    return "student"; // Default fallback
  };

  const role = getUserRole();

  const getDashboardSuggestions = () => {
    const baseSuggestions = [
      {
        title: "Dashboard Home",
        description: "Return to your main dashboard",
        href: `/dashboard/${role}`,
        icon: LayoutDashboard,
      },
    ];

    if (role === "student") {
      return [
        ...baseSuggestions,
        {
          title: "My Courses",
          description: "View your enrolled courses",
          href: "/dashboard/student/courses",
          icon: BookOpen,
        },
        {
          title: "Calendar",
          description: "Check your schedule and events",
          href: "/dashboard/student/calendar",
          icon: Calendar,
        },
        {
          title: "Settings",
          description: "Manage your account settings",
          href: "/dashboard/student/settings",
          icon: Settings,
        },
      ];
    }

    if (role === "instructor") {
      return [
        ...baseSuggestions,
        {
          title: "My Courses",
          description: "Manage your courses",
          href: "/dashboard/instructor/courses",
          icon: BookOpen,
        },
        {
          title: "Students",
          description: "View and manage your students",
          href: "/dashboard/instructor/students",
          icon: Users,
        },
        {
          title: "Calendar",
          description: "Manage your schedule",
          href: "/dashboard/instructor/calendar",
          icon: Calendar,
        },
      ];
    }

    if (role === "admin") {
      return [
        ...baseSuggestions,
        {
          title: "Manage Courses",
          description: "Oversee all courses",
          href: "/dashboard/admin/courses",
          icon: BookOpen,
        },
        {
          title: "Manage Users",
          description: "Manage all platform users",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          title: "Settings",
          description: "Platform administration",
          href: "/dashboard/admin/settings",
          icon: Settings,
        },
      ];
    }

    return baseSuggestions;
  };

  const suggestions = getDashboardSuggestions();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 404 Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Dashboard Page Not Found
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
            The dashboard page you're looking for doesn't exist or you don't have permission to access it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Link href={`/dashboard/${role}`}>
            <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Home
            </Button>
          </Link>

          <Link href="/">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              Main Site
            </Button>
          </Link>
        </div>

        {/* Dashboard Suggestions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              Available Dashboard Sections
            </CardTitle>
            <CardDescription>
              Here are the dashboard areas you can access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={suggestion.href}
                  className="group block p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <suggestion.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        {user && (
          <div className="text-center mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Logged in as <strong>{user.displayName || user.email}</strong>
              {role && (
                <span className="ml-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded-full text-xs">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          <p>
            Need help navigating the dashboard?{" "}
            <Link
              href="/dashboard/support"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact support
            </Link>
            {" "}or{" "}
            <Link
              href="/help"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              view our help docs
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
