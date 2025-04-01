"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  DollarSign,
  BarChart,
  Activity,
  Loader2,
  BarChart3,
  Clock,
  Star,
  CircleDollarSign,
  User,
  Gauge,
  LayoutGrid,
  FileSpreadsheet,
  Search,
  ChevronDown,
  Check,
  Pencil,
  Trash,
  UserPlus,
  UserCheck,
  ShoppingCart,
  Shield,
  Settings,
  HelpCircle,
  Database,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

export default function AdminDashboard() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
    averageRating: 0,
    recentUsers: [],
    usersByRole: {
      student: 0,
      lecturer: 0,
      admin: 0,
    },
    monthlySales: [],
    popularCourses: [],
    recentEnrollments: [],
  });

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: {
      total: 0,
      students: 0,
      lecturers: 0,
      admins: 0,
    },
    courses: {
      total: 0,
      published: 0,
      draft: 0,
    },
    enrollments: {
      total: 0,
      active: 0,
      completed: 0,
    },
    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);

        // Fetch user data to confirm role
        const userResponse = await fetch("/api/users/me");
        const userData = await userResponse.json();

        if (!userData.success || userData.data?.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        // Fetch admin dashboard data
        const dashboardResponse = await fetch("/api/admin/dashboard");
        const dashboardData = await dashboardResponse.json();

        if (!dashboardData.success) {
          throw new Error("Failed to fetch dashboard data");
        }

        setDashboardData(dashboardData.data || {});

        // If we don't have API data yet, fall back to mock data
        if (!dashboardData.data) {
          // Mock data for development
          setTimeout(() => {
            setDashboardData({
              totalUsers: 156,
              totalCourses: 28,
              totalRevenue: 12450,
              totalEnrollments: 342,
              recentUsers: [
                {
                  id: "user1",
                  name: "Emily Johnson",
                  email: "emily.johnson@example.com",
                  role: "student",
                  joinDate: "2023-10-15T00:00:00.000Z",
                },
                {
                  id: "user2",
                  name: "Michael Chen",
                  email: "michael.chen@example.com",
                  role: "student",
                  joinDate: "2023-10-14T00:00:00.000Z",
                },
                {
                  id: "user3",
                  name: "Sarah Williams",
                  email: "sarah.williams@example.com",
                  role: "lecturer",
                  joinDate: "2023-10-12T00:00:00.000Z",
                },
                {
                  id: "user4",
                  name: "David Miller",
                  email: "david.miller@example.com",
                  role: "student",
                  joinDate: "2023-10-10T00:00:00.000Z",
                },
              ],
              popularCourses: [
                {
                  id: "course1",
                  title: "JavaScript Fundamentals",
                  instructor: "John Smith",
                  enrollments: 85,
                  rating: 4.8,
                  revenue: 4250,
                },
                {
                  id: "course2",
                  title: "Advanced React Patterns",
                  instructor: "Jane Doe",
                  enrollments: 72,
                  rating: 4.7,
                  revenue: 3600,
                },
                {
                  id: "course3",
                  title: "Node.js API Masterclass",
                  instructor: "Mike Johnson",
                  enrollments: 64,
                  rating: 4.6,
                  revenue: 3200,
                },
              ],
              usersByRole: {
                student: 120,
                lecturer: 32,
                admin: 4,
              },
              recentEnrollments: [
                {
                  id: "enr1",
                  user: "Alex Thompson",
                  course: "JavaScript Fundamentals",
                  date: "2023-10-15T00:00:00.000Z",
                },
                {
                  id: "enr2",
                  user: "Maria Garcia",
                  course: "Advanced React Patterns",
                  date: "2023-10-14T00:00:00.000Z",
                },
                {
                  id: "enr3",
                  user: "David Kim",
                  course: "Node.js API Masterclass",
                  date: "2023-10-12T00:00:00.000Z",
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
            totalUsers: 156,
            totalCourses: 28,
            totalRevenue: 12450,
            totalEnrollments: 342,
            recentUsers: [
              {
                id: "user1",
                name: "Emily Johnson",
                email: "emily.johnson@example.com",
                role: "student",
                joinDate: "2023-10-15T00:00:00.000Z",
              },
              {
                id: "user2",
                name: "Michael Chen",
                email: "michael.chen@example.com",
                role: "student",
                joinDate: "2023-10-14T00:00:00.000Z",
              },
              {
                id: "user3",
                name: "Sarah Williams",
                email: "sarah.williams@example.com",
                role: "lecturer",
                joinDate: "2023-10-12T00:00:00.000Z",
              },
              {
                id: "user4",
                name: "David Miller",
                email: "david.miller@example.com",
                role: "student",
                joinDate: "2023-10-10T00:00:00.000Z",
              },
            ],
            popularCourses: [
              {
                id: "course1",
                title: "JavaScript Fundamentals",
                instructor: "John Smith",
                enrollments: 85,
                rating: 4.8,
                revenue: 4250,
              },
              {
                id: "course2",
                title: "Advanced React Patterns",
                instructor: "Jane Doe",
                enrollments: 72,
                rating: 4.7,
                revenue: 3600,
              },
              {
                id: "course3",
                title: "Node.js API Masterclass",
                instructor: "Mike Johnson",
                enrollments: 64,
                rating: 4.6,
                revenue: 3200,
              },
            ],
            usersByRole: {
              student: 120,
              lecturer: 32,
              admin: 4,
            },
            recentEnrollments: [
              {
                id: "enr1",
                user: "Alex Thompson",
                course: "JavaScript Fundamentals",
                date: "2023-10-15T00:00:00.000Z",
              },
              {
                id: "enr2",
                user: "Maria Garcia",
                course: "Advanced React Patterns",
                date: "2023-10-14T00:00:00.000Z",
              },
              {
                id: "enr3",
                user: "David Kim",
                course: "Node.js API Masterclass",
                date: "2023-10-12T00:00:00.000Z",
              },
            ],
          });
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchDashboardData();
  }, [userId, isLoaded, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For demonstration, we're loading mock data
        // In a real application, these would be API calls to fetch statistics
        setTimeout(() => {
          // Make sure we're setting primitive values, not objects
          setStats({
            users: {
              total: 1250,
              students: 1180,
              lecturers: 45,
              admins: 25,
            },
            courses: {
              total: 75,
              published: 52,
              draft: 23,
            },
            enrollments: {
              total: 3450,
              active: 2800,
              completed: 650,
            },
            revenue: {
              total: 32500,
              thisMonth: 4200,
              lastMonth: 3800,
            },
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleUserEdit = (user) => {
    setUserToEdit(user);
    setShowUserDialog(true);
  };

  const handleUserDelete = (userId) => {
    setConfirmDelete(userId);
  };

  const confirmUserDelete = async () => {
    try {
      // In a real app, send delete request to API
      // await fetch(`/api/users/${confirmDelete}`, {
      //   method: 'DELETE',
      // });

      // Update UI by filtering out the deleted user
      setDashboardData({
        ...dashboardData,
        recentUsers: dashboardData.recentUsers.filter(
          (user) => user.id !== confirmDelete
        ),
        totalUsers: dashboardData.totalUsers - 1,
        usersByRole: {
          ...dashboardData.usersByRole,
          // Decrement the count for the role of the deleted user
          [dashboardData.recentUsers.find((user) => user.id === confirmDelete)
            ?.role]:
            dashboardData.usersByRole[
              dashboardData.recentUsers.find(
                (user) => user.id === confirmDelete
              )?.role
            ] - 1,
        },
      });

      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
      setConfirmDelete(null);
    }
  };

  const handleUserSave = async (userData) => {
    try {
      // In a real app, send update request to API
      // await fetch(`/api/users/${userData.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });

      // Update UI with the edited user data
      setDashboardData({
        ...dashboardData,
        recentUsers: dashboardData.recentUsers.map((user) =>
          user.id === userData.id ? { ...user, ...userData } : user
        ),
      });

      setShowUserDialog(false);
      setUserToEdit(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = dashboardData.recentUsers.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // Pagination
  const usersPerPage = 7;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{dashboardData.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Courses</p>
              <h3 className="text-2xl font-bold">
                {dashboardData.totalCourses}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                {formatCurrency(dashboardData.totalRevenue)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Enrollments</p>
              <h3 className="text-2xl font-bold">
                {dashboardData.totalEnrollments}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Users</h2>
            <Link
              href="/dashboard/admin/users"
              className="text-blue-600 hover:underline text-sm flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md"
              >
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "lecturer"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(user.joinDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Courses */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Popular Courses</h2>
            <Link
              href="/dashboard/admin/courses"
              className="text-blue-600 hover:underline text-sm flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.popularCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.enrollments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {course.rating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(course.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Students</span>
                <span className="text-sm text-gray-500">
                  {Math.round(
                    (dashboardData.usersByRole.student /
                      dashboardData.totalUsers) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (dashboardData.usersByRole.student /
                        dashboardData.totalUsers) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Lecturers</span>
                <span className="text-sm text-gray-500">
                  {Math.round(
                    (dashboardData.usersByRole.lecturer /
                      dashboardData.totalUsers) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (dashboardData.usersByRole.lecturer /
                        dashboardData.totalUsers) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Admins</span>
                <span className="text-sm text-gray-500">
                  {Math.round(
                    (dashboardData.usersByRole.admin /
                      dashboardData.totalUsers) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (dashboardData.usersByRole.admin /
                        dashboardData.totalUsers) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Enrollments</h2>
            <Link
              href="/dashboard/admin/enrollments"
              className="text-blue-600 hover:underline text-sm flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData.recentEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <h3 className="font-medium">{enrollment.user}</h3>
                  <p className="text-sm text-gray-500">
                    enrolled in {enrollment.course}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(enrollment.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
