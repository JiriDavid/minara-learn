"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LecturerDashboard() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    courseCompletionRate: 0,
    averageRating: 0,
    recentEnrollments: [],
    topCourses: [],
    recentReviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
    totalHours: 0,
    averageRating: 0,
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);

        // Fetch user data to confirm role
        const userResponse = await fetch("/api/users/me");
        const userData = await userResponse.json();

        if (!userData.success || userData.data?.role !== "lecturer") {
          router.push("/dashboard");
          return;
        }

        // Fetch lecturer's courses
        const coursesResponse = await fetch("/api/courses/lecturer");
        const coursesData = await coursesResponse.json();

        if (!coursesData.success) {
          throw new Error("Failed to fetch courses");
        }

        // Fetch course stats (enrollments, completions, ratings)
        const statsResponse = await fetch("/api/lecturer/stats");
        const statsData = await statsResponse.json();

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
        console.error("Error fetching dashboard data:", error);

        // Fall back to mock data on error
        setTimeout(() => {
          // Use the existing mock data setup
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, isLoaded, router]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  // Format date in a readable way
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Lecturer Dashboard
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Manage your courses and view performance metrics
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          onClick={() => router.push("/dashboard/lecturer/courses/create")}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
              {dashboardData.totalCourses}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <Users className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
              {dashboardData.totalStudents}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
              ${dashboardData.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
              <Star className="h-8 w-8 text-amber-600 dark:text-amber-300" />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
              {dashboardData.averageRating}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Average Rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Courses */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Top Performing Courses</CardTitle>
            <CardDescription>
              Your most successful courses based on enrollment and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4"
                >
                  <div className="mb-2 md:mb-0">
                    <h4 className="text-base font-medium text-slate-900 dark:text-white">
                      {course.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Users className="mr-1 h-4 w-4" />
                        {course.students} students
                      </span>
                      <span className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Star className="mr-1 h-4 w-4 text-amber-500" />
                        {course.rating}
                      </span>
                      <span className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />$
                        {course.revenue}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/lecturer/courses/${course.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/lecturer/courses">View All Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Enrollments</CardTitle>
            <CardDescription>
              Latest students who enrolled in your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {enrollment.studentName}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {enrollment.courseName}
                    </p>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-500">
                    {new Date(enrollment.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Reviews</CardTitle>
            <CardDescription>
              Latest feedback from your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-slate-200 dark:border-slate-700 pb-3"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {review.studentName}
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {review.courseName}
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-300">
                    "{review.comment}"
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Courses</h2>
          <Link href="/dashboard/lecturer/courses">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          course.status === "published"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.students}</TableCell>
                    <TableCell>{course.lessons}</TableCell>
                    <TableCell>
                      {course.rating > 0 ? `${course.rating}/5.0` : "N/A"}
                    </TableCell>
                    <TableCell>{formatDate(course.lastUpdated)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/learn/${course.slug}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/lecturer/courses/${course.id}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/lecturer/courses/create">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create New Course</h3>
                    <p className="text-sm text-muted-foreground">
                      Start building a new educational course
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/lecturer/analytics">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">View Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Check performance metrics for your courses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/lecturer/resources">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Learning Resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Access resources for course creation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
