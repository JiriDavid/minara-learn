"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Clock, GraduationCap, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState({
    inProgressCourses: [],
    completedCourses: 0,
    totalHoursLearned: 0,
    certificates: 0,
    recentActivities: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);

        // Fetch user data to confirm role
        const userResponse = await fetch("/api/users/me");
        const userData = await userResponse.json();

        if (!userData.success || userData.data?.role !== "student") {
          router.push("/dashboard");
          return;
        }

        // Fetch student's enrollments and progress
        const enrollmentsResponse = await fetch("/api/student/enrollments");
        const enrollmentsData = await enrollmentsResponse.json();

        if (!enrollmentsData.success) {
          throw new Error("Failed to fetch enrollments");
        }

        // Fetch activity data
        const activityResponse = await fetch("/api/student/activity");
        const activityData = await activityResponse.json();

        // Transform the API data into the expected dashboard data structure
        const dashboardData = {
          enrolledCourses: enrollmentsData.data?.length || 0,
          completedCourses:
            enrollmentsData.data?.filter((e) => e.progress === 100).length || 0,
          totalHoursLearned: calculateTotalHours(enrollmentsData.data || []),
          certificatesEarned:
            enrollmentsData.data?.filter((e) => e.certificateIssued).length ||
            0,
          inProgressCourses: enrollmentsData.data || [],
          recentActivity: activityData.data || [],
        };

        setDashboardData(dashboardData);

        // If we don't have API data yet, fall back to mock data
        if (!enrollmentsData.data || enrollmentsData.data.length === 0) {
          // Use the existing mock data
          setTimeout(() => {
            setDashboardData({
              enrolledCourses: 5,
              completedCourses: 2,
              totalHoursLearned: 27,
              certificatesEarned: 2,
              inProgressCourses: [
                {
                  id: "course1",
                  title: "JavaScript Fundamentals",
                  slug: "javascript-fundamentals",
                  progress: 65,
                  image: "/images/course-js.jpg",
                  instructor: "John Doe",
                  lastAccessed: "2023-10-14T00:00:00.000Z",
                },
                {
                  id: "course2",
                  title: "React - The Complete Guide",
                  slug: "react-complete-guide",
                  progress: 32,
                  image: "/images/course-react.jpg",
                  instructor: "Jane Smith",
                  lastAccessed: "2023-10-12T00:00:00.000Z",
                },
                {
                  id: "course3",
                  title: "Node.js API Masterclass",
                  slug: "nodejs-api-masterclass",
                  progress: 18,
                  image: "/images/course-node.jpg",
                  instructor: "Mike Johnson",
                  lastAccessed: "2023-10-10T00:00:00.000Z",
                },
              ],
              recentActivity: [
                {
                  id: "act1",
                  type: "lesson_completed",
                  course: "JavaScript Fundamentals",
                  detail: "Variables and Data Types",
                  date: "2023-10-15T00:00:00.000Z",
                },
                {
                  id: "act2",
                  type: "course_started",
                  course: "React - The Complete Guide",
                  detail: "",
                  date: "2023-10-12T00:00:00.000Z",
                },
                {
                  id: "act3",
                  type: "certificate_earned",
                  course: "HTML & CSS Bootcamp",
                  detail: "",
                  date: "2023-10-05T00:00:00.000Z",
                },
                {
                  id: "act4",
                  type: "course_completed",
                  course: "HTML & CSS Bootcamp",
                  detail: "",
                  date: "2023-10-05T00:00:00.000Z",
                },
                {
                  id: "act5",
                  type: "lesson_completed",
                  course: "JavaScript Fundamentals",
                  detail: "Functions and Scope",
                  date: "2023-10-02T00:00:00.000Z",
                },
              ],
            });
            setIsLoading(false);
          }, 1000);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        // Fall back to mock data on error
        setTimeout(() => {
          setDashboardData({
            enrolledCourses: 5,
            completedCourses: 2,
            totalHoursLearned: 27,
            certificatesEarned: 2,
            inProgressCourses: [
              {
                id: "course1",
                title: "JavaScript Fundamentals",
                slug: "javascript-fundamentals",
                progress: 65,
                image: "/images/course-js.jpg",
                instructor: "John Doe",
                lastAccessed: "2023-10-14T00:00:00.000Z",
              },
              {
                id: "course2",
                title: "React - The Complete Guide",
                slug: "react-complete-guide",
                progress: 32,
                image: "/images/course-react.jpg",
                instructor: "Jane Smith",
                lastAccessed: "2023-10-12T00:00:00.000Z",
              },
              {
                id: "course3",
                title: "Node.js API Masterclass",
                slug: "nodejs-api-masterclass",
                progress: 18,
                image: "/images/course-node.jpg",
                instructor: "Mike Johnson",
                lastAccessed: "2023-10-10T00:00:00.000Z",
              },
            ],
            recentActivity: [
              {
                id: "act1",
                type: "lesson_completed",
                course: "JavaScript Fundamentals",
                detail: "Variables and Data Types",
                date: "2023-10-15T00:00:00.000Z",
              },
              {
                id: "act2",
                type: "course_started",
                course: "React - The Complete Guide",
                detail: "",
                date: "2023-10-12T00:00:00.000Z",
              },
              {
                id: "act3",
                type: "certificate_earned",
                course: "HTML & CSS Bootcamp",
                detail: "",
                date: "2023-10-05T00:00:00.000Z",
              },
              {
                id: "act4",
                type: "course_completed",
                course: "HTML & CSS Bootcamp",
                detail: "",
                date: "2023-10-05T00:00:00.000Z",
              },
              {
                id: "act5",
                type: "lesson_completed",
                course: "JavaScript Fundamentals",
                detail: "Functions and Scope",
                date: "2023-10-02T00:00:00.000Z",
              },
            ],
          });
          setIsLoading(false);
        }, 1000);
      }
    };

    // Helper function to calculate total hours learned from enrollments
    const calculateTotalHours = (enrollments) => {
      return enrollments
        .reduce((total, enrollment) => {
          const courseHours = enrollment.course?.duration || 0;
          const percentComplete = enrollment.progress / 100;
          return total + (courseHours * percentComplete) / 60; // Convert minutes to hours
        }, 0)
        .toFixed(1);
    };

    fetchDashboardData();
  }, [userId, isLoaded, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome back! Here's an overview of your learning progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <BookOpen className="h-6 w-6 text-blue-700 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {dashboardData.inProgressCourses.length +
                dashboardData.completedCourses}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Zap className="h-6 w-6 text-green-700 dark:text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {dashboardData.completedCourses}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Completed Courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <Clock className="h-6 w-6 text-purple-700 dark:text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {dashboardData.totalHoursLearned}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Hours Learned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <GraduationCap className="h-6 w-6 text-yellow-700 dark:text-yellow-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {dashboardData.certificates}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Certificates Earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* In Progress Courses */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            In Progress
          </h2>
          <Link href="/dashboard/student/courses">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>

        {dashboardData.inProgressCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardData.inProgressCourses.map((course) => (
              <div
                key={course._id}
                className="relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
              >
                <Link href={`/learn/${course.slug}`}>
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {course.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {course.progress}% complete
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        Last accessed {formatDate(course.lastAccessed)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                You don't have any courses in progress.
              </p>
              <Link href="/courses">
                <Button className="mt-4">Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Recent Activity
        </h2>

        {dashboardData.recentActivities.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {dashboardData.recentActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {activity.type === "lesson_completed" &&
                            "Completed lesson:"}
                          {activity.type === "course_started" &&
                            "Started course:"}
                          {activity.type === "certificate_earned" &&
                            "Earned certificate:"}{" "}
                          <span className="font-semibold">
                            {activity.title}
                          </span>
                        </p>
                        {activity.course && (
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Course: {activity.course}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-500">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No recent activity to show.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
