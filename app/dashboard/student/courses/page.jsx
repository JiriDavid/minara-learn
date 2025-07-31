"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import CourseProgress from "@/components/CourseProgress";
import { convertMinutesToHours } from "@/lib/utils";

export default function StudentCoursesPage() {
  const router = useRouter();
  const { user, profile, role, isStudent, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState({
    inProgress: [],
    completed: [],
  });

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        // Wait for auth to load
        if (authLoading) return;
        
        // Redirect if not authenticated
        if (!user) {
          router.replace("/auth/signin");
          return;
        }

        // Redirect if not a student
        if (!isStudent) {
          router.push("/dashboard");
          return;
        }

        setIsLoading(true);
        
        // Fetch actual enrollment data
        const response = await fetch("/api/student/enrollments");
        if (response.ok) {
          const enrollments = await response.json();
          
          // Separate into in-progress and completed
          const inProgress = enrollments.filter(e => e.progress < 100);
          const completed = enrollments.filter(e => e.progress === 100);
          
          setCourses({
            inProgress,
            completed
          });
        } else {
          console.error("Failed to fetch enrollments");
          setCourses({
            inProgress: [],
            completed: []
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        // Set empty arrays on error
        setCourses({
          inProgress: [],
          completed: []
        });
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user, authLoading, isStudent, router]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = {
    inProgress: courses.inProgress.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    completed: courses.completed.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const courseCount = courses.inProgress.length + courses.completed.length;

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Courses
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {courseCount === 0
              ? "You haven't enrolled in any courses yet"
              : `You're enrolled in ${courseCount} ${
                  courseCount === 1 ? "course" : "courses"
                }`}
          </p>
        </div>

        <div className="mt-4 flex w-full md:mt-0 md:w-auto md:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full appearance-none pl-8"
            />
          </div>
        </div>
      </div>

      {courseCount === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <BookOpen className="h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-xl font-medium text-slate-900 dark:text-white">
            No Courses Found
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            You haven't enrolled in any courses yet. Start your learning journey
            today!
          </p>
          <Button className="mt-6" asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="in-progress">
          <TabsList className="mb-6">
            <TabsTrigger value="in-progress">
              In Progress ({filteredCourses.inProgress.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({filteredCourses.completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress">
            {filteredCourses.inProgress.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-slate-600 dark:text-slate-400">
                  {searchQuery
                    ? "No in-progress courses found matching your search"
                    : "You don't have any in-progress courses"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.inProgress.map((course) => (
                  <div
                    key={course._id}
                    className="rounded-lg border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="relative h-40">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span>Progress: {course.enrollment.progress}%</span>
                          <span className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            {course.enrollment.completedLessons.length}/
                            {course.totalLessons}
                          </span>
                        </div>
                        <Progress
                          value={course.enrollment.progress}
                          className="h-2"
                        />

                        <div className="flex justify-between pt-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Last accessed:{" "}
                            {new Date(course.lastAccessed).toLocaleDateString()}
                          </span>
                        </div>

                        <Button className="w-full" asChild>
                          <Link href={`/learn/${course.slug}`}>
                            Continue Learning
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {filteredCourses.completed.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-slate-600 dark:text-slate-400">
                  {searchQuery
                    ? "No completed courses found matching your search"
                    : "You haven't completed any courses yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.completed.map((course) => (
                  <div
                    key={course._id}
                    className="rounded-lg border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="relative h-40">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600">Completed</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span>
                            Completed on:{" "}
                            {new Date(course.completedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/learn/${course.slug}`}>Review</Link>
                          </Button>
                          {course.certificateId && (
                            <Button
                              variant="default"
                              className="flex-1"
                              asChild
                            >
                              <Link
                                href={`/certificate/${course.certificateId}`}
                              >
                                Certificate
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
