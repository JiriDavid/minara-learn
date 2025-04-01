"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
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
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState({
    inProgress: [],
    completed: [],
  });

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);
        // In a real app, fetch from API
        // const response = await fetch("/api/student/courses");
        // const data = await response.json();

        // Mock data for demonstration
        const mockCourses = {
          inProgress: [
            {
              _id: "course1",
              slug: "javascript-fundamentals",
              title: "JavaScript Fundamentals",
              description:
                "Learn the core concepts of JavaScript programming language.",
              thumbnail:
                "https://placehold.co/600x400/2563eb/FFFFFF/png?text=JavaScript+Fundamentals",
              lecturer: {
                name: "John Doe",
                image: "https://placehold.co/150/2563eb/FFFFFF/png?text=JD",
              },
              lastAccessed: "2023-10-14T15:34:23Z",
              enrollment: {
                enrolledAt: "2023-09-05T12:00:00Z",
                progress: 35,
                completedLessons: ["lesson3", "lesson1"],
              },
              sections: [
                {
                  _id: "section1",
                  title: "Getting Started with JavaScript",
                  lessons: [
                    {
                      _id: "lesson1",
                      title: "Introduction to JavaScript",
                      duration: 15,
                      isCompleted: true,
                    },
                    {
                      _id: "lesson2",
                      title: "Setting Up Your Development Environment",
                      duration: 20,
                      isCompleted: false,
                    },
                  ],
                },
                {
                  _id: "section2",
                  title: "JavaScript Basics",
                  lessons: [
                    {
                      _id: "lesson3",
                      title: "Variables and Data Types",
                      duration: 25,
                      isCompleted: true,
                    },
                    {
                      _id: "lesson4",
                      title: "Operators and Expressions",
                      duration: 30,
                      isCompleted: false,
                    },
                  ],
                },
              ],
              totalLessons: 4,
            },
            {
              _id: "course2",
              slug: "react-for-beginners",
              title: "React for Beginners",
              description:
                "Learn the basics of React and build your first application.",
              thumbnail:
                "https://placehold.co/600x400/16a34a/FFFFFF/png?text=React+for+Beginners",
              lecturer: {
                name: "Jane Smith",
                image: "https://placehold.co/150/16a34a/FFFFFF/png?text=JS",
              },
              lastAccessed: "2023-10-16T09:12:45Z",
              enrollment: {
                enrolledAt: "2023-09-12T12:00:00Z",
                progress: 50,
                completedLessons: ["lesson1", "lesson2"],
              },
              sections: [
                {
                  _id: "section1",
                  title: "React Fundamentals",
                  lessons: [
                    {
                      _id: "lesson1",
                      title: "Introduction to React",
                      duration: 20,
                      isCompleted: true,
                    },
                    {
                      _id: "lesson2",
                      title: "Components and Props",
                      duration: 25,
                      isCompleted: true,
                    },
                  ],
                },
                {
                  _id: "section2",
                  title: "State and Lifecycle",
                  lessons: [
                    {
                      _id: "lesson3",
                      title: "State in React",
                      duration: 30,
                      isCompleted: false,
                    },
                    {
                      _id: "lesson4",
                      title: "Component Lifecycle Methods",
                      duration: 35,
                      isCompleted: false,
                    },
                  ],
                },
              ],
              totalLessons: 4,
            },
          ],
          completed: [
            {
              _id: "course3",
              slug: "html-css-basics",
              title: "HTML & CSS Basics",
              description:
                "Master the fundamentals of web development with HTML and CSS.",
              thumbnail:
                "https://placehold.co/600x400/dc2626/FFFFFF/png?text=HTML+%26+CSS+Basics",
              lecturer: {
                name: "Sarah Johnson",
                image: "https://placehold.co/150/dc2626/FFFFFF/png?text=SJ",
              },
              completedAt: "2023-08-25T14:23:10Z",
              enrollment: {
                enrolledAt: "2023-07-15T12:00:00Z",
                progress: 100,
                completedLessons: ["lesson1", "lesson2", "lesson3", "lesson4"],
              },
              sections: [
                {
                  _id: "section1",
                  title: "HTML Basics",
                  lessons: [
                    {
                      _id: "lesson1",
                      title: "Introduction to HTML",
                      duration: 15,
                      isCompleted: true,
                    },
                    {
                      _id: "lesson2",
                      title: "HTML Elements and Structure",
                      duration: 20,
                      isCompleted: true,
                    },
                  ],
                },
                {
                  _id: "section2",
                  title: "CSS Basics",
                  lessons: [
                    {
                      _id: "lesson3",
                      title: "Introduction to CSS",
                      duration: 25,
                      isCompleted: true,
                    },
                    {
                      _id: "lesson4",
                      title: "CSS Selectors and Properties",
                      duration: 30,
                      isCompleted: true,
                    },
                  ],
                },
              ],
              totalLessons: 4,
              certificateId: "CERT-1234-5678",
            },
          ],
        };

        setCourses(mockCourses);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId, isLoaded]);

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

  if (!isLoaded || isLoading) {
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
