"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  Users,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const suggestions = [
    {
      title: "Browse Courses",
      description: "Explore our wide range of educational courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      title: "Dashboard",
      description: "Access your personal learning dashboard",
      href: "/dashboard",
      icon: Users,
    },
    {
      title: "About Us",
      description: "Learn more about Minara Learn platform",
      href: "/about",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 404 Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white mb-4">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Page Not Found
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
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
          
          <Link href="/">
            <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Suggestions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Maybe you're looking for one of these?
            </CardTitle>
            <CardDescription>
              Here are some popular sections of our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
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

        {/* Help Text */}
        <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>
            If you believe this is an error, please{" "}
            <Link
              href="/contact"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
