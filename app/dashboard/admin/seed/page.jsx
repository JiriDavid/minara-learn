"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Database,
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen,
  Star,
  Clock,
  FileText,
  Clipboard,
} from "lucide-react";

export default function SeedDatabasePage() {
  const [loading, setLoading] = useState({
    users: false,
    courses: false,
    enrollments: false,
    completions: false,
    reviews: false,
  });
  const [results, setResults] = useState({
    users: null,
    courses: null,
    enrollments: null,
    completions: null,
    reviews: null,
  });

  const handleSeed = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    setResults((prev) => ({ ...prev, [type]: null }));

    try {
      // Default params for different seed types
      const params = {
        users: { students: 20, lecturers: 5, admins: 2 },
        courses: { count: 10, withLessons: true },
        enrollments: { count: 50 },
        completions: { count: 100 },
        reviews: { count: 30 },
      };

      const response = await fetch(`/api/seed/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params[type]),
      });

      const data = await response.json();
      setResults((prev) => ({ ...prev, [type]: data }));
    } catch (error) {
      console.error(`Error seeding ${type}:`, error);
      setResults((prev) => ({
        ...prev,
        [type]: {
          success: false,
          message: error.message || `Failed to seed ${type}`,
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Admin Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Seed Database</h1>
        <p className="text-muted-foreground mt-1">
          Populate your database with sample data for testing and development
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
              Important Note
            </h3>
            <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
              This tool is intended for development and testing environments
              only. Seeding will add sample data to your database which may
              affect existing data.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Seed Users</h2>
                <p className="text-sm text-muted-foreground">
                  Create sample students, lecturers, and admins
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSeed("users")}
              disabled={loading.users}
              className={`px-4 py-2 rounded-md ${
                loading.users
                  ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {loading.users ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </button>
          </div>
          <div className="p-6">
            {results.users ? (
              <div>
                {results.users.success ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
                      <p className="text-green-800 dark:text-green-300 text-sm">
                        {results.users.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                      <p className="text-red-800 dark:text-red-300 text-sm">
                        {results.users.message}
                      </p>
                    </div>
                  </div>
                )}
                {results.users.counts && (
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {results.users.counts.students}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Students
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-md">
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {results.users.counts.lecturers}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        Lecturers
                      </p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-md">
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">
                        {results.users.counts.admins}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Admins
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
                <p>Generate sample users</p>
              </div>
            )}
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Seed Courses</h2>
                <p className="text-sm text-muted-foreground">
                  Create sample courses with sections and lessons
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSeed("courses")}
              disabled={loading.courses}
              className={`px-4 py-2 rounded-md ${
                loading.courses
                  ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {loading.courses ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </button>
          </div>
          <div className="p-6">
            {results.courses ? (
              <div>
                {results.courses.success ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
                      <p className="text-green-800 dark:text-green-300 text-sm">
                        {results.courses.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                      <p className="text-red-800 dark:text-red-300 text-sm">
                        {results.courses.message}
                      </p>
                    </div>
                  </div>
                )}
                {results.courses.count && (
                  <div className="mt-4">
                    <p className="text-center mb-3">
                      <span className="text-2xl font-bold">
                        {results.courses.count}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        courses created
                      </span>
                    </p>
                    {results.courses.courses && (
                      <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="p-2 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-medium">
                            Example Courses
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(results.courses.courses, null, 2)
                              )
                            }
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            <Clipboard className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="p-2 text-xs font-mono overflow-x-auto max-h-24">
                          {results.courses.courses
                            .slice(0, 3)
                            .map((course, i) => (
                              <div key={i} className="mb-1">
                                {course.title}
                              </div>
                            ))}
                          {results.courses.courses.length > 3 && (
                            <div className="text-muted-foreground">
                              ...and {results.courses.courses.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
                <p>Generate sample courses</p>
              </div>
            )}
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Seed Enrollments</h2>
                <p className="text-sm text-muted-foreground">
                  Create sample course enrollments
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSeed("enrollments")}
              disabled={loading.enrollments}
              className={`px-4 py-2 rounded-md ${
                loading.enrollments
                  ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {loading.enrollments ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </button>
          </div>
          <div className="p-6">
            {results.enrollments ? (
              <div>
                {results.enrollments.success ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
                      <p className="text-green-800 dark:text-green-300 text-sm">
                        {results.enrollments.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                      <p className="text-red-800 dark:text-red-300 text-sm">
                        {results.enrollments.message}
                      </p>
                    </div>
                  </div>
                )}
                {results.enrollments.count && (
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold">
                      {results.enrollments.count}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      enrollments created
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
                <p>Generate sample enrollments</p>
              </div>
            )}
          </div>
        </div>

        {/* Completions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full mr-3">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Seed Completions</h2>
                <p className="text-sm text-muted-foreground">
                  Create sample lesson completions
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSeed("completions")}
              disabled={loading.completions}
              className={`px-4 py-2 rounded-md ${
                loading.completions
                  ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {loading.completions ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </button>
          </div>
          <div className="p-6">
            {results.completions ? (
              <div>
                {results.completions.success ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
                      <p className="text-green-800 dark:text-green-300 text-sm">
                        {results.completions.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                      <p className="text-red-800 dark:text-red-300 text-sm">
                        {results.completions.message}
                      </p>
                    </div>
                  </div>
                )}
                {results.completions.count && (
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold">
                      {results.completions.count}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      completions created
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
                <p>Generate sample completions</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-3">
                <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Seed Reviews</h2>
                <p className="text-sm text-muted-foreground">
                  Create sample course reviews
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSeed("reviews")}
              disabled={loading.reviews}
              className={`px-4 py-2 rounded-md ${
                loading.reviews
                  ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {loading.reviews ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </button>
          </div>
          <div className="p-6">
            {results.reviews ? (
              <div>
                {results.reviews.success ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
                      <p className="text-green-800 dark:text-green-300 text-sm">
                        {results.reviews.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                      <p className="text-red-800 dark:text-red-300 text-sm">
                        {results.reviews.message}
                      </p>
                    </div>
                  </div>
                )}
                {results.reviews.count && (
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold">
                      {results.reviews.count}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      reviews created
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
                <p>Generate sample reviews</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Seeding Sequence</h2>
        <p className="text-muted-foreground mb-4">
          For best results, seed data in the following order:
        </p>
        <ol className="space-y-2 list-decimal list-inside">
          <li className="text-sm">
            Users - Creates students, lecturers, and admins
          </li>
          <li className="text-sm">
            Courses - Creates courses with sections and lessons
          </li>
          <li className="text-sm">
            Enrollments - Creates student enrollments in courses
          </li>
          <li className="text-sm">
            Completions - Tracks completed lessons for students
          </li>
          <li className="text-sm">Reviews - Adds student reviews to courses</li>
        </ol>
      </div>
    </div>
  );
}
