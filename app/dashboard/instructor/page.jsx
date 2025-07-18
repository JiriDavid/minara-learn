"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  BookOpen,
  BarChart3,
  TrendingUp,
  PlusCircle,
  Clock,
  Star,
  Award,
  FileText,
  Loader2,
  Eye,
  Plus,
  Activity,
  CalendarDays,
  MessageSquare,
  ChevronRight,
  BookMarked,
  Pencil,
  Settings,
  ListChecks,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageLoader, CardSkeleton } from "@/components/ui/loading";

const InstructorDashboard = memo(() => {
  const router = useRouter();
  const { user, loading: authLoading, isInstructor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    courseCompletionRate: 0,
    averageRating: 0,
    recentEnrollments: [],
    topCourses: [],
    recentReviews: [],
    pendingTasks: [],
    upcomingSchedule: [],
  });
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
    totalHours: 0,
    averageRating: 0,
  });
  const [courses, setCourses] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log("🎯 Instructor dashboard: Starting fetchDashboardData");
      console.log("🔍 Current state:", { user: !!user, authLoading, isInstructor, dataFetched });
      
      if (!user || authLoading || dataFetched) {
        console.log("⏹️ Exiting early - conditions not met");
        return;
      }

      if (!isInstructor) {
        console.log("❌ User not instructor, redirecting to dashboard");
        router.push("/dashboard");
        return;
      }

      console.log("✅ Starting data fetch for instructor:", user.email);
      setLoading(true);
      setDataFetched(true);

        // Fetch instructor's courses
        console.log("Fetching courses...");
        const coursesResponse = await fetch("/api/courses/instructor");
        const coursesData = await coursesResponse.json();
        console.log("Courses response:", coursesData);

        if (!coursesData.success) {
          throw new Error("Failed to fetch courses");
        }

        // Fetch course stats (enrollments, completions, ratings)
        console.log("Fetching stats...");
        const statsResponse = await fetch("/api/instructor/stats");
        const statsData = await statsResponse.json();
        console.log("Stats response:", statsData);

        // Process the data to create the dashboard data
        const courses = coursesData.data || [];
        const stats = statsData.data || {
          totalStudents: 0,
          totalRevenue: 0,
          averageRating: 0,
          recentEnrollments: [],
          recentReviews: [],
        };

        // Transform the API data into the expected dashboard data structure
        const dashboardData = {
          totalCourses: courses.length,
          totalStudents: stats.totalStudents || 0,
          totalRevenue: stats.totalRevenue || 0,
          courseCompletionRate: stats.courseCompletionRate || 0,
          averageRating: stats.averageRating || 0,
          recentEnrollments: stats.recentEnrollments || [],
          topCourses: courses.slice(0, 3).map((course) => ({
            id: course._id,
            title: course.title,
            students: course.enrollmentCount || 0,
            rating: course.averageRating || 0,
            revenue: course.revenue || 0,
          })),
          recentReviews: stats.recentReviews || [],
          pendingTasks: [
            {
              id: "task1",
              title: "Grade JavaScript Projects",
              dueDate: "2023-10-18T00:00:00.000Z",
              course: "JavaScript Fundamentals",
              pendingCount: 5,
              priority: "high",
            },
            {
              id: "task2",
              title: "Review React Assignment Submissions",
              dueDate: "2023-10-20T00:00:00.000Z",
              course: "React - The Complete Guide",
              pendingCount: 8,
              priority: "medium",
            },
            {
              id: "task3",
              title: "Update Node.js Course Materials",
              dueDate: "2023-10-25T00:00:00.000Z",
              course: "Node.js API Masterclass",
              pendingCount: 1,
              priority: "low",
            },
          ],
          upcomingSchedule: [
            {
              id: "event1",
              title: "Live Q&A Session",
              date: "2023-10-19T15:00:00.000Z",
              course: "JavaScript Fundamentals",
              type: "webinar",
              attendees: 28,
            },
            {
              id: "event2",
              title: "Office Hours",
              date: "2023-10-21T13:00:00.000Z",
              course: "React - The Complete Guide",
              type: "meeting",
              attendees: 5,
            },
            {
              id: "event3",
              title: "Project Review Session",
              date: "2023-10-22T14:00:00.000Z",
              course: "Node.js API Masterclass",
              type: "workshop",
              attendees: 12,
            },
          ],
        };

        setDashboardData(dashboardData);
        setCourses(courses);

        // If we don't have API data yet, fall back to mock data
        if (courses.length === 0) {
          // Use the existing mock data
          setTimeout(() => {
            setStats({
              totalCourses: 8,
              publishedCourses: 5,
              draftCourses: 3,
              totalStudents: 342,
              totalHours: 47,
              averageRating: 4.7,
            });

            // Keep the existing mock courses
            setLoading(false);
          }, 1000);
        } else {
          setStats({
            totalCourses: courses.length,
            publishedCourses: courses.filter((c) => c.isPublished).length,
            draftCourses: courses.filter((c) => !c.isPublished).length,
            totalStudents: stats.totalStudents || 0,
            totalHours:
              courses.reduce((acc, course) => acc + (course.duration || 0), 0) /
              60,
            averageRating: stats.averageRating || 0,
          });

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching instructor dashboard data:", error);
        setLoading(false);
        setDataFetched(false); // Allow retry on error
      }
    }, [user, authLoading, isInstructor, dataFetched]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format date in a readable way - moved before conditional return
  const formatDate = useCallback((dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const formatDateTime = useCallback((dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Show page loader while auth is loading or initial data loading
  if (authLoading) {
    return <PageLoader message="Loading instructor dashboard..." />;
  }

  // If user is not authenticated, redirect to signin
  if (!user) {
    router.push('/auth/signin');
    return <PageLoader message="Redirecting to sign in..." />;
  }

  // If user is not an instructor, redirect to main dashboard
  if (!isInstructor) {
    router.push('/dashboard');
    return <PageLoader message="Redirecting to dashboard..." />;
  }

  // Show loading state for data
  if (loading && !dataFetched) {
    return <PageLoader message="Loading instructor dashboard..." />;
  }

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back, {user?.displayName || "Instructor"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your courses and track student progress
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/instructor/courses/create">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Create New Course</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview with Improved Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.totalCourses}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats.publishedCourses} published, {stats.draftCourses} draft
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
              <Users className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.totalStudents}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              12 new this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${dashboardData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              $1,200 this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
              <Star className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.averageRating.toFixed(1)}
            </div>
            <div className="flex mt-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.round(dashboardData.averageRating)
                      ? "fill-current"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Course Management & Analytics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Your Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Courses</h2>
              <Link href="/dashboard/instructor/courses">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <Card
                  key={course._id || course.id}
                  className="border-0 shadow-md overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-1/3 lg:w-1/4">
                      <Image
                        src={
                          course.thumbnail || "/images/course-placeholder.jpg"
                        }
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      {course.isPublished ? (
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          Published
                        </Badge>
                      ) : (
                        <Badge className="absolute top-2 right-2 bg-amber-500">
                          Draft
                        </Badge>
                      )}
                    </div>
                    <div className="p-4 md:w-2/3 lg:w-3/4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg mb-1">
                            {course.title}
                          </h3>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-amber-500 fill-current" />
                            <span className="ml-1 mr-2">
                              {course.averageRating || course.rating || "New"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="text-xs flex items-center gap-1 text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded-full">
                            <Users className="h-3 w-3" />
                            <span>
                              {course.enrollmentCount || "0"} students
                            </span>
                          </div>
                          <div className="text-xs flex items-center gap-1 text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            <span>{course.totalLessons || "0"} lessons</span>
                          </div>
                          <div className="text-xs flex items-center gap-1 text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded-full">
                            <FileText className="h-3 w-3" />
                            <span>${course.price || "0"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/dashboard/instructor/courses/${
                            course._id || course.id
                          }`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/instructor/courses/${
                            course._id || course.id
                          }/edit`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/instructor/courses/${
                            course._id || course.id
                          }/analytics`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <BarChart3 className="h-3 w-3" />
                            Analytics
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {courses.length === 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <BookMarked className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                  <p className="text-slate-500 mb-4">
                    Start creating your first course to share your knowledge
                    with students
                  </p>
                  <Link href="/dashboard/instructor/courses/create">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Student Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Recent Student Enrollments
            </h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentEnrollments.length > 0 ? (
                      dashboardData.recentEnrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">
                            {enrollment.studentName}
                          </TableCell>
                          <TableCell>{enrollment.course}</TableCell>
                          <TableCell>{formatDate(enrollment.date)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-6 text-slate-500"
                        >
                          No recent enrollments
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Schedule & Tasks */}
        <div className="space-y-8">
          {/* Pending Tasks */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Pending Tasks</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                {dashboardData.pendingTasks.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.pendingTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              : task.priority === "medium"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                          }`}
                        >
                          <ListChecks className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{task.title}</h3>
                            <Badge
                              variant={
                                task.priority === "high"
                                  ? "destructive"
                                  : task.priority === "medium"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Course: {task.course}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-slate-500">
                              Due: {formatDate(task.dueDate)}
                            </p>
                            <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                              {task.pendingCount} pending
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ListChecks className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500">No pending tasks</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-800 p-4">
                <Link
                  href="/dashboard/instructor/tasks"
                  className="text-blue-600 hover:underline text-sm flex items-center mx-auto"
                >
                  View all tasks <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Upcoming Schedule */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Upcoming Schedule</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                {dashboardData.upcomingSchedule.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.upcomingSchedule.map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg p-2 h-fit">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {event.course}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-slate-500">
                              {formatDateTime(event.date)}
                            </p>
                            <Badge variant="outline" className="ml-2">
                              {event.attendees} attendees
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CalendarDays className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500">No upcoming events</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-800 p-4">
                <Link
                  href="/dashboard/instructor/calendar"
                  className="text-blue-600 hover:underline text-sm flex items-center mx-auto"
                >
                  View full calendar <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Student Reviews */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                {dashboardData.recentReviews.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentReviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">
                            {review.studentName}
                          </div>
                          <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-current"
                                    : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          "{review.comment}"
                        </p>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>{review.course}</span>
                          <span>{formatDate(review.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500">No reviews yet</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-800 p-4">
                <Link
                  href="/dashboard/instructor/reviews"
                  className="text-blue-600 hover:underline text-sm flex items-center mx-auto"
                >
                  View all reviews <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

InstructorDashboard.displayName = 'InstructorDashboard';

export default InstructorDashboard;
