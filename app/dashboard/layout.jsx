"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (!userId) return;

        const response = await fetch("/api/users/me");
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchUserRole();
    }
  }, [userId, isLoaded]);

  useEffect(() => {
    // Close sidebar when route changes on mobile
    setSidebarOpen(false);
  }, [pathname]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!userId) {
    router.push("/sign-in");
    return null;
  }

  // Navigation items based on user role
  const getNavItems = () => {
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
          title: "Certificates",
          href: "/dashboard/student/certificates",
          icon: GraduationCap,
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

    items.push({
      title: "Settings",
      href: `/dashboard/${role}/settings`,
      icon: Settings,
      active: pathname === `/dashboard/${role}/settings`,
    });

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-20 left-4 z-40 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-white dark:bg-slate-900 p-6 
        border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative
      `}
      >
        <div className="mb-8 mt-8 md:mt-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-md 
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
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {children}
      </div>
    </div>
  );
}
