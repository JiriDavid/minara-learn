"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import useStore from "@/lib/store/useStore";
import { Button } from "@/components/ui/button";
import { Search, Menu, Book, BarChart, Sun, Moon, X } from "lucide-react";

const Navbar = () => {
  const { userId, isLoaded } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useStore();
  const [mounted, setMounted] = useState(false);

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
    }
  }, [theme]);

  // Determine if the current path is a dashboard path
  const isDashboard = pathname?.includes("/dashboard");

  // Dashboard routes by role (will need to be updated based on Clerk user metadata)
  const getDashboardLink = () => {
    if (!isLoaded || !userId) return "/sign-in";
    // For now, we'll default to student dashboard
    // This would need to be updated based on how you store roles in Clerk
    return "/dashboard/student";
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="font-bold text-xl text-blue-600 dark:text-blue-400"
              >
                E-Xtra LMS
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/"
                    ? "border-blue-500 text-slate-900 dark:text-white"
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

              {isLoaded && userId ? (
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
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="primary">Register</Button>
                  </SignUpButton>
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

            <div className="px-3 py-3 space-y-2">
              <Link href="/search" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={closeMenu}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </Link>

              {isLoaded && userId ? (
                <>
                  <Link href={getDashboardLink()} className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={closeMenu}
                    >
                      {isDashboard ? (
                        <Book className="h-5 w-5 mr-2" />
                      ) : (
                        <BarChart className="h-5 w-5 mr-2" />
                      )}
                      {isDashboard ? "My Courses" : "Dashboard"}
                    </Button>
                  </Link>
                  <div className="py-2 flex items-center">
                    <UserButton afterSignOutUrl="/" />
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      Account
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="primary" className="w-full">
                      Register
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
