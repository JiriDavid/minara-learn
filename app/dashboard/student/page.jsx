"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Award,
  ChevronRight,
  BarChart,
  Calendar,
  Star,
  TrendingUp,
  BookMarked,
  Check,
  Bell,
  MessageSquare,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    totalHoursLearned: 0,
    certificatesEarned: 0,
    inProgressCourses: [],
    recentActivity: [],
    upcomingEvents: [],
    recommendedCourses: [],
    achievements: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) return;

        setIsLoading(true);

        // Fetch user data to confirm role
        const userResponse = await fetch("/api/users/me");
        const userData = await userResponse.json();

        if (userResponse.status === 401 || !userData.success) {
          router.replace("/auth/signin");
          return;
        }

        if (!userData.data?.role || userData.data.role !== "student") {
          router.push("/dashboard");
          return;
        }

        // Fetch student's enrollments and progress
        const enrollmentsResponse = await fetch("/api/student/enrollments");
        const enrollmentsData = await enrollmentsResponse.json();

        // Fetch activity data
        const activityResponse = await fetch("/api/student/activity");
        const activityData = await activityResponse.json();

        // Transform the API data into the expected dashboard data structure
        const transformedData = {
          enrolledCourses: enrollmentsData?.length || 0,
          completedCourses:
            enrollmentsData?.filter((e) => e.progress === 100).length || 0,
          totalHoursLearned: calculateTotalHours(enrollmentsData || []),
          certificatesEarned:
            enrollmentsData?.filter((e) => e.certificateIssued).length || 0,
          inProgressCourses: enrollmentsData || [],
          recentActivity: activityData || [],
          upcomingEvents: [],
          recommendedCourses: [],
          achievements: [],
        };

        setDashboardData(transformedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Use mock data on error
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
              thumbnail:
                "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              instructor: "John Doe",
              lastAccessed: "2023-10-14T00:00:00.000Z",
              totalLessons: 24,
              completedLessons: 16,
              nextLesson: "Functions and Scope",
            },
            {
              id: "course2",
              title: "React - The Complete Guide",
              slug: "react-complete-guide",
              progress: 32,
              image: "/images/course-react.jpg",
              thumbnail:
                "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              instructor: "Jane Smith",
              lastAccessed: "2023-10-12T00:00:00.000Z",
              totalLessons: 42,
              completedLessons: 13,
              nextLesson: "State and Props",
            },
            {
              id: "course3",
              title: "Node.js API Masterclass",
              slug: "nodejs-api-masterclass",
              progress: 18,
              image: "/images/course-node.jpg",
              thumbnail:
                "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              instructor: "Mike Johnson",
              lastAccessed: "2023-10-10T00:00:00.000Z",
              totalLessons: 36,
              completedLessons: 6,
              nextLesson: "Express Middleware",
            },
          ],
          recentActivity: [
            {
              id: "act1",
              type: "lesson_completed",
              course: "JavaScript Fundamentals",
              detail: "Variables and Data Types",
              date: "2023-10-15T00:00:00.000Z",
              icon: "check",
            },
            {
              id: "act2",
              type: "course_started",
              course: "React - The Complete Guide",
              detail: "",
              date: "2023-10-12T00:00:00.000Z",
              icon: "play",
            },
            {
              id: "act3",
              type: "certificate_earned",
              course: "HTML & CSS Bootcamp",
              detail: "",
              date: "2023-10-05T00:00:00.000Z",
              icon: "award",
            },
            {
              id: "act4",
              type: "quiz_passed",
              course: "JavaScript Fundamentals",
              detail: "Functions and Objects Quiz",
              date: "2023-10-14T00:00:00.000Z",
              icon: "check",
            },
            {
              id: "act5",
              type: "feedback_received",
              course: "React - The Complete Guide",
              detail: "Your project received feedback",
              date: "2023-10-11T00:00:00.000Z",
              icon: "message",
            },
          ],
          upcomingEvents: [
            {
              id: "event1",
              title: "Live Q&A Session",
              course: "JavaScript Fundamentals",
              date: "2023-10-18T18:00:00.000Z",
              type: "webinar",
            },
            {
              id: "event2",
              title: "Project Submission Deadline",
              course: "React - The Complete Guide",
              date: "2023-10-25T23:59:00.000Z",
              type: "deadline",
            },
            {
              id: "event3",
              title: "Group Discussion",
              course: "Node.js API Masterclass",
              date: "2023-10-20T17:00:00.000Z",
              type: "discussion",
            },
          ],
          recommendedCourses: [
            {
              id: "rec1",
              title: "Advanced JavaScript Concepts",
              slug: "advanced-javascript",
              thumbnail:
                "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              instructor: "John Doe",
              rating: 4.8,
              reviewCount: 325,
              level: "Advanced",
            },
            {
              id: "rec2",
              title: "Redux for React Developers",
              slug: "redux-react-developers",
              thumbnail:
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              instructor: "Jane Smith",
              rating: 4.7,
              reviewCount: 218,
              level: "Intermediate",
            },
          ],
          achievements: [
            {
              id: "ach1",
              title: "Fast Learner",
              description: "Completed 5 lessons in one day",
              date: "2023-10-15T00:00:00.000Z",
              icon: "zap",
            },
            {
              id: "ach2",
              title: "Perfect Score",
              description: "Achieved 100% on a quiz",
              date: "2023-10-08T00:00:00.000Z",
              icon: "award",
            },
          ],
        });
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, router]);

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

  // Function to get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case "lesson_completed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "course_started":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "certificate_earned":
        return <Award className="h-4 w-4 text-purple-600" />;
      case "quiz_passed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "feedback_received":
        return <MessageSquare className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back, {user?.displayName || "Student"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Continue your learning journey and track your progress
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <Badge variant="secondary" className="ml-1">
              3
            </Badge>
          </Button>
          <Link href="/courses">
            <Button className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Explore Courses</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview with Improved Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Courses
            </CardTitle>
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.enrolledCourses}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {dashboardData.completedCourses} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
              <BarChart className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.enrolledCourses
                ? Math.round(
                    (dashboardData.completedCourses /
                      dashboardData.enrolledCourses) *
                      100
                  )
                : 0}
              %
            </div>
            <Progress
              value={
                dashboardData.enrolledCourses
                  ? Math.round(
                      (dashboardData.completedCourses /
                        dashboardData.enrolledCourses) *
                        100
                    )
                  : 0
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.totalHoursLearned}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              3.5 hours this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
              <Award className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.certificatesEarned}
            </div>
            <Link
              href="/certificates"
              className="text-xs text-blue-600 hover:underline flex items-center mt-1"
            >
              View all certificates
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Continue Learning & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Continue Learning</h2>
              <Link href="/courses/my-courses">
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
              {dashboardData.inProgressCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-0 shadow-md overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-1/3 lg:w-1/4">
                      <Image
                        src={
                          course.thumbnail ||
                          course.image ||
                          "/images/course-placeholder.jpg"
                        }
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 md:w-2/3 lg:w-3/4 flex flex-col justify-between">
                      <div>
                        <Link href={`/learn/${course.slug}`}>
                          <h3 className="font-bold text-lg mb-1 hover:text-blue-600 transition-colors">
                            {course.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Instructor: {course.instructor}
                        </p>

                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{course.progress}% complete</span>
                            <span>
                              {course.completedLessons}/{course.totalLessons}{" "}
                              lessons
                            </span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Next up:</span>{" "}
                          {course.nextLesson}
                        </p>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                          Last accessed: {formatDate(course.lastAccessed)}
                        </span>
                        <Link href={`/learn/${course.slug}`}>
                          <Button size="sm">Continue</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity with Timeline */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={activity.id} className="relative">
                      <div className="absolute -left-7 top-1 bg-white dark:bg-slate-900 p-1 rounded-full border-2 border-slate-200 dark:border-slate-700">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-base">
                            {activity.course}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {formatDate(activity.date)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {activity.detail ||
                            activity.type.split("_").join(" ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Upcoming Events, Recommendations, Achievements */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                {dashboardData.upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.upcomingEvents.map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg p-2 h-fit">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {event.course}
                          </p>
                          <p className="text-xs mt-1 text-slate-500">
                            {new Date(event.date).toLocaleString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500">No upcoming events</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-800 p-4">
                <Link
                  href="/calendar"
                  className="text-blue-600 hover:underline text-sm flex items-center mx-auto"
                >
                  View full calendar <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Recommended Courses */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
            <div className="space-y-4">
              {dashboardData.recommendedCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-0 shadow-md overflow-hidden"
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={course.thumbnail || "/images/course-placeholder.jpg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-blue-600">{course.level}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/courses/${course.slug}`}>
                      <h3 className="font-bold text-base mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {course.instructor}
                    </p>
                    <div className="flex items-center text-sm">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1">{course.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500 ml-1">
                        ({course.reviewCount} reviews)
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 dark:bg-slate-800 p-4">
                    <Link href={`/courses/${course.slug}`}>
                      <Button size="sm" className="w-full">
                        View Course
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/courses/recommendations">
                <Button variant="outline">View All Recommendations</Button>
              </Link>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                {dashboardData.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3"
                      >
                        <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 p-2 rounded-full">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Award className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500">
                      Complete courses to earn achievements
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-800 p-4">
                <Link
                  href="/achievements"
                  className="text-blue-600 hover:underline text-sm flex items-center mx-auto"
                >
                  View all achievements{" "}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
