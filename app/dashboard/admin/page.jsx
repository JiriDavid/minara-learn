"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
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
  CalendarDays,
  PlusCircle,
  Building,
  Bell,
  ArrowUpRight,
  LineChart,
  Presentation,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Label } from "../../../components/ui/label";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
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
        if (!user) return;

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
  }, [user, router]);

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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your platform, users, and courses
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/dashboard/admin/instructor-applications">
            <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
              <GraduationCap className="h-4 w-4" />
              <span>Instructor Applications</span>
            </Button>
          </Link>
          <Link href="/dashboard/admin/users/new">
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </Link>
          <Link href="/dashboard/admin/reports">
            <Button variant="outline" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Reports</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.totalUsers}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {dashboardData.usersByRole.student} students,{" "}
              {dashboardData.usersByRole.lecturer} lecturers
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
              <BookOpen className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.totalCourses}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />5 new this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${dashboardData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />$
              {(dashboardData.totalRevenue * 0.1).toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollments
            </CardTitle>
            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
              <GraduationCap className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.totalEnrollments}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              32 new enrollments this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Users & Courses */}
        <div className="lg:col-span-2 space-y-8">
          {/* Users Management */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Link href="/dashboard/admin/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          Filter:{" "}
                          {filterRole === "all" ? "All Roles" : filterRole}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setFilterRole("all")}>
                          {filterRole === "all" && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          All Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFilterRole("student")}
                        >
                          {filterRole === "student" && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Student
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFilterRole("lecturer")}
                        >
                          {filterRole === "lecturer" && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Lecturer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFilterRole("admin")}
                        >
                          {filterRole === "admin" && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href="/dashboard/admin/users/new">
                      <Button size="sm" className="flex items-center gap-1">
                        <UserPlus className="h-4 w-4" />
                        Add User
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.recentUsers.length > 0 ? (
                        dashboardData.recentUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  user.role === "admin"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                    : user.role === "lecturer"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                }`}
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(user.joinDate)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserEdit(user)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserDelete(user.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-6 text-slate-500"
                          >
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Popular Courses</h2>
              <Link href="/dashboard/admin/courses">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.popularCourses.length > 0 ? (
                      dashboardData.popularCourses.map((course) => (
                        <TableRow
                          key={course.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <TableCell className="font-medium">
                            <Link
                              href={`/dashboard/admin/courses/${course.id}`}
                              className="hover:text-blue-600"
                            >
                              {course.title}
                            </Link>
                          </TableCell>
                          <TableCell>{course.instructor}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-slate-400" />
                              {course.enrollments}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="mr-1">{course.rating}</span>
                              <Star className="h-4 w-4 text-amber-500 fill-current" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ${formatCurrency(course.revenue)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-slate-500"
                        >
                          No courses found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Analytics & Activity */}
        <div className="space-y-8">
          {/* User Analytics */}
          <div>
            <h2 className="text-2xl font-bold mb-4">User Distribution</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {dashboardData.usersByRole.student}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Students
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {dashboardData.usersByRole.lecturer}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Lecturers
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {dashboardData.usersByRole.admin}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Admins
                    </p>
                  </div>
                </div>

                {/* Placeholder for user distribution chart */}
                <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      User Distribution Chart
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-800 p-4">
                <Link
                  href="/dashboard/admin/analytics/users"
                  className="text-blue-600 hover:underline text-sm flex items-center mx-auto"
                >
                  View detailed analytics{" "}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Enrollments</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                {dashboardData.recentEnrollments.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentEnrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-start gap-3"
                      >
                        <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                          <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{enrollment.user}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enrolled in{" "}
                            <span className="font-medium">
                              {enrollment.course}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDate(enrollment.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingCart className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500">No recent enrollments</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-800 p-4">
                <Link
                  href="/dashboard/admin/enrollments"
                  className="text-blue-600 hover:underline text-sm flex items-center mx-auto"
                >
                  View all enrollments <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Platform Analytics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Revenue */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>
                Revenue generated across the platform in the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for monthly revenue chart */}
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    Monthly Revenue Chart
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New user registrations over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for user growth chart */}
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">User Growth Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User and Delete Dialogs */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's details here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={userToEdit?.name}
                onChange={(e) =>
                  setUserToEdit({ ...userToEdit, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userToEdit?.email}
                onChange={(e) =>
                  setUserToEdit({ ...userToEdit, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={userToEdit?.role}
                onChange={(e) =>
                  setUserToEdit({ ...userToEdit, role: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleUserSave(userToEdit)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDelete !== null}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this user?
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" onClick={confirmUserDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
