
"use client";
import "@/app/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import useStore from "@/lib/store/useStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Search,
  Menu,
  Book,
  BarChart,
  Sun,
  Moon,
  X,
  LogOut,
  User,
} from "lucide-react";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useStore();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Apply the correct theme on initial load
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Determine if the current path is a dashboard path
  const isDashboard = pathname?.includes("/dashboard");

  // Dashboard routes by role
  const getDashboardLink = () => {
    if (loading || !user) return "/login";
    // For now, we'll default to student dashboard
    // This would need to be updated based on user role from profile
    return "/dashboard/student";
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Select logo based on theme
  const logoSrc = theme === "dark" ? "/minara-learn-logo-white.svg" : "/minara-learn-logo-black.svg";

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="-ml-4 flex items-center">
            <Link href="/">
              <Image
                src={logoSrc}
                width={200}
                height={100}
                alt="Minara Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/"
                    ? "border-[#03045e] text-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/courses" || pathname?.startsWith("/courses/")
                    ? "border-blue-500 text-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                Courses
              </Link>
              <Link
                href="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/about"
                    ? "border-blue-500 text-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/contact"
                    ? "border-blue-500 text-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="mr-2"
                aria-label="Toggle theme"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Desktop Search & Auth */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link href="/search">
                <Button variant="ghost" size="icon" aria-label="Search">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>

              {!loading && user ? (
                <>
                  <Link href={getDashboardLink()}>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      {isDashboard ? (
                        <Book className="h-5 w-5 mr-2" />
                      ) : (
                        <BarChart className="h-5 w-5 mr-2" />
                      )}
                      <span>{isDashboard ? "My Courses" : "Dashboard"}</span>
                    </Button>
                  </Link>
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-900 shadow-lg rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden z-50 hidden group-hover:block">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary">Register</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Open menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === "/"
                  ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === "/courses" || pathname?.startsWith("/courses/")
                  ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
              onClick={closeMenu}
            >
              Courses
            </Link>
            <Link
              href="/about"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === "/about"
                  ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === "/contact"
                  ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-800">
            {!loading && user ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-slate-800 dark:text-slate-200">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    href={getDashboardLink()}
                    className="block px-4 py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMenu();
                    }}
                    className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
