"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SeedDatabase() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Initialize stats with proper structure to avoid rendering objects directly
  const [stats, setStats] = useState({
    users: {
      loading: false,
      error: null,
      data: {
        students: 0,
        lecturers: 0,
        admins: 0,
      },
    },
    courses: {
      loading: false,
      error: null,
      data: {
        total: 0,
      },
    },
    enrollments: {
      loading: false,
      error: null,
      data: {
        total: 0,
      },
    },
  });

  // Fetch current stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Update users loading state
        setStats((prev) => ({
          ...prev,
          users: {
            ...prev.users,
            loading: true,
            error: null,
          },
        }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update with mock data
        setStats((prev) => ({
          ...prev,
          users: {
            loading: false,
            error: null,
            data: {
              students: 12,
              lecturers: 5,
              admins: 2,
            },
          },
        }));
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          users: {
            ...prev.users,
            loading: false,
            error: "Failed to fetch user stats",
          },
        }));
      }
    };

    fetchStats();
  }, []);

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      setError(null);
      setSuccess(false);

      // Step 1: Seed Users
      setStats((prev) => ({
        ...prev,
        users: {
          ...prev.users,
          loading: true,
          error: null,
        },
      }));

      const userResponse = await fetch("/api/seed/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          students: 50,
          lecturers: 10,
          admins: 3,
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to seed users");
      }

      const userData = await userResponse.json();

      // Step 2: Seed Courses
      setStats((prev) => ({
        ...prev,
        courses: {
          ...prev.courses,
          loading: true,
          error: null,
        },
      }));

      const courseResponse = await fetch("/api/seed/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: 25,
          withLessons: true,
        }),
      });

      if (!courseResponse.ok) {
        throw new Error("Failed to seed courses");
      }

      const courseData = await courseResponse.json();

      // Step 3: Seed Enrollments
      setStats((prev) => ({
        ...prev,
        enrollments: {
          ...prev.enrollments,
          loading: true,
          error: null,
        },
      }));

      const enrollmentResponse = await fetch("/api/seed/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: 120,
        }),
      });

      if (!enrollmentResponse.ok) {
        throw new Error("Failed to seed enrollments");
      }

      const enrollmentData = await enrollmentResponse.json();

      // Step 4: Fetch updated stats
      const statsResponse = await fetch("/api/seed/stats");
      const statsData = await statsResponse.json();

      // Update stats with real data
      setStats({
        users: {
          loading: false,
          error: null,
          data: {
            students: statsData.users.students || userData.counts.students,
            lecturers: statsData.users.lecturers || userData.counts.lecturers,
            admins: statsData.users.admins || userData.counts.admins,
          },
        },
        courses: {
          loading: false,
          error: null,
          data: {
            total: statsData.courses.total || courseData.count,
          },
        },
        enrollments: {
          loading: false,
          error: null,
          data: {
            total: statsData.enrollments.total || enrollmentData.count,
          },
        },
      });

      setSuccess(true);
      setSeeding(false);
    } catch (err) {
      console.error("Seeding error:", err);
      setError(err.message || "Failed to seed database");
      setSeeding(false);

      // Reset loading states
      setStats((prev) => ({
        users: {
          ...prev.users,
          loading: false,
        },
        courses: {
          ...prev.courses,
          loading: false,
        },
        enrollments: {
          ...prev.enrollments,
          loading: false,
        },
      }));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Seed Database</h1>
          <p className="text-muted-foreground">
            Generate sample data for development and testing
          </p>
        </div>
        <Link href="/dashboard/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Users</CardTitle>
            <CardDescription>Students, lecturers and admins</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.users.loading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : stats.users.error ? (
              <div className="text-red-500 text-sm">{stats.users.error}</div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold">
                    {stats.users.data?.students || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.users.data?.lecturers || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Lecturers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.users.data?.admins || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Admins</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Courses</CardTitle>
            <CardDescription>Learning materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold">
                {stats.courses.data?.total || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total courses</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enrollments</CardTitle>
            <CardDescription>Course registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold">
                {stats.enrollments.data?.total || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Total enrollments
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>
            This will generate sample data for your LMS platform. Use this for
            development and testing purposes only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>50 students with profiles and enrollments</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>10 lecturers with profiles</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>25 courses with lessons and materials</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Course ratings and reviews</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
              <Check className="h-5 w-5 mr-2" />
              Database seeded successfully!
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSeedDatabase} disabled={seeding}>
            {seeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : (
              "Seed Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
