"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  BarChart,
  PlusCircle,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  Search,
  Calendar,
  Award,
  HelpCircle,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New course available",
      description: "Advanced JavaScript Concepts is now available",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Assignment graded",
      description: "Your React project has been graded",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "Live session reminder",
      description: "JavaScript Q&A session starts in 1 hour",
      time: "Just now",
      read: false,
    },
  ]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (!authLoading && !user) {
          router.replace("/login");
          return;
        }

        const response = await fetch("/api/users/me");
        const data = await response.json();

        if (response.status === 401 || !data.success) {
          console.log("Authentication failed, redirecting to login");
          router.replace("/login");
          return;
        }

        if (data.success && data.data?.role) {
          setRole(data.data.role);

          // If we're at the base dashboard URL, redirect to the role-specific dashboard
          if (pathname === "/dashboard") {
            router.push(`/dashboard/${data.data.role}`);
          }
        } else {
          console.error("Invalid user data format:", data);
          router.replace("/login");
          return;
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        router.replace("/login");
        return;
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading, pathname, router]);

  useEffect(() => {
    // Close sidebar when route changes on mobile
    setSidebarOpen(false);
  }, [pathname]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!authLoading && !user) {
    router.replace("/login");
    return;
  }

  // Navigation items based on user role
  const getNavItems = () => {
    if (!role) return [];

    const items = [
      {
        title: "Dashboard",
        href: `/dashboard/${role}`,
        icon: LayoutDashboard,
        active: pathname === `/dashboard/${role}`,
      },
    ];

    if (role === "student") {
      items.push(
        {
          title: "My Courses",
          href: "/dashboard/student/courses",
          icon: BookOpen,
          active: pathname === "/dashboard/student/courses",
        },
        {
          title: "Calendar",
          href: "/dashboard/student/calendar",
          icon: Calendar,
          active: pathname === "/dashboard/student/calendar",
        },
        {
          title: "Certificates",
          href: "/dashboard/student/certificates",
          icon: Award,
          active: pathname === "/dashboard/student/certificates",
        }
      );
    }

    if (role === "lecturer") {
      items.push(
        {
          title: "My Courses",
          href: "/dashboard/lecturer/courses",
          icon: BookOpen,
          active: pathname === "/dashboard/lecturer/courses",
        },
        {
          title: "Create Course",
          href: "/dashboard/lecturer/courses/create",
          icon: PlusCircle,
          active: pathname === "/dashboard/lecturer/courses/create",
        },
        {
          title: "Students",
          href: "/dashboard/lecturer/students",
          icon: Users,
          active: pathname === "/dashboard/lecturer/students",
        },
        {
          title: "Calendar",
          href: "/dashboard/lecturer/calendar",
          icon: Calendar,
          active: pathname === "/dashboard/lecturer/calendar",
        }
      );
    }

    if (role === "admin") {
      items.push(
        {
          title: "Courses",
          href: "/dashboard/admin/courses",
          icon: BookOpen,
          active: pathname === "/dashboard/admin/courses",
        },
        {
          title: "Users",
          href: "/dashboard/admin/users",
          icon: Users,
          active: pathname === "/dashboard/admin/users",
        },
        {
          title: "Analytics",
          href: "/dashboard/admin/analytics",
          icon: BarChart,
          active: pathname === "/dashboard/admin/analytics",
        }
      );
    }

    // Common menu items for all roles
    items.push(
      {
        title: "Help & Support",
        href: `/dashboard/${role}/support`,
        icon: HelpCircle,
        active: pathname === `/dashboard/${role}/support`,
      },
      {
        title: "Settings",
        href: `/dashboard/${role}/settings`,
        icon: Settings,
        active: pathname === `/dashboard/${role}/settings`,
      }
    );

    return items;
  };

  const navItems = getNavItems();
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-full bg-white shadow-md hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 transform overflow-y-auto bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative
      `}
      >
        <div className="p-6">
          {/* Logo and branding */}
          <div className="mb-8 flex items-center">
            {/* <div className="mr-3 relative h-10 w-10">
              <Image
                src="/images/zimsec.png"
                alt="E-X-TRA LMS"
                fill
                className="object-contain"
              />
            </div> */}
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              E-X-TRA LMS
            </h1>
          </div>

          {/* User profile simple version */}
          <div className="mb-8 rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-blue-600">
                {(user?.displayName || "User").substring(0, 2).toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {user?.displayName || "User"}
                </p>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                  {user?.email || ""}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Link href={`/dashboard/${role}/profile`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Main Navigation
            </p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg
                  transition-colors ease-in-out duration-200
                  ${
                    item.active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </div>

          {/* Public site link */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
            >
              <Home className="mr-3 h-5 w-5" />
              Back to Website
            </Link>
          </div>
        </div>
      </div>

      {/* Main content area with header */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex-1 flex items-center">
            <div className="md:hidden text-lg font-semibold">
              {role
                ? `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`
                : "Dashboard"}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications indicator */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>

            {/* User menu button */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => signOut && signOut()}
                className="h-9 flex items-center gap-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {(user?.displayName || "User").substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  Logout
                </span>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content with scrolling */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
