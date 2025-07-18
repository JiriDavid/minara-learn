"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  MoreVertical,
  Plus,
  Users,
  Clock,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CourseManagement() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);

        // Fetch user data to confirm role
        const userResponse = await fetch("/api/users/me");
        const userData = await userResponse.json();

        if (!userData.success || userData.data?.role !== "instructor") {
          router.push("/dashboard");
          return;
        }

        // Fetch instructor's courses
        const coursesResponse = await fetch("/api/courses/instructor");
        const coursesData = await coursesResponse.json();

        if (!coursesData.success) {
          throw new Error("Failed to fetch courses");
        }

        const courseData = coursesData.data || [];
        setCourses(courseData);
        setFilteredCourses(courseData);

        // If we don't have API data yet, fall back to mock data
        if (!coursesData.data || coursesData.data.length === 0) {
          // Mock course data for development
          setTimeout(() => {
            const mockCourses = [
              {
                _id: "1",
                title: "Complete JavaScript Course 2023",
                slug: "complete-javascript-course-2023",
                isPublished: true,
                enrollmentCount: 185,
                averageRating: 4.8,
                category: "Programming",
                level: "Beginner",
                createdAt: "2023-08-01T00:00:00.000Z",
                updatedAt: "2023-08-15T00:00:00.000Z",
              },
              {
                _id: "2",
                title: "React - The Complete Guide",
                slug: "react-the-complete-guide",
                isPublished: true,
                enrollmentCount: 120,
                averageRating: 4.9,
                category: "Web Development",
                level: "Intermediate",
                createdAt: "2023-09-01T00:00:00.000Z",
                updatedAt: "2023-09-10T00:00:00.000Z",
              },
              {
                _id: "3",
                title: "Node.js API Masterclass",
                slug: "nodejs-api-masterclass",
                isPublished: true,
                enrollmentCount: 37,
                averageRating: 4.6,
                category: "Backend",
                level: "Advanced",
                createdAt: "2023-06-01T00:00:00.000Z",
                updatedAt: "2023-06-22T00:00:00.000Z",
              },
              {
                _id: "4",
                title: "MongoDB for Developers",
                slug: "mongodb-for-developers",
                isPublished: false,
                enrollmentCount: 0,
                averageRating: 0,
                category: "Database",
                level: "Intermediate",
                createdAt: "2023-10-01T00:00:00.000Z",
                updatedAt: "2023-10-05T00:00:00.000Z",
              },
              {
                _id: "5",
                title: "Advanced CSS and Sass",
                slug: "advanced-css-and-sass",
                isPublished: true,
                enrollmentCount: 0,
                averageRating: 4.5,
                category: "Web Development",
                level: "Intermediate",
                createdAt: "2023-07-15T00:00:00.000Z",
                updatedAt: "2023-07-30T00:00:00.000Z",
              },
            ];
            setCourses(mockCourses);
            setFilteredCourses(mockCourses);
            setIsLoading(false);
          }, 1000);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [userId, isLoaded, router]);

  // Update filtered courses when search term or filter status changes
  useEffect(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "published" && course.isPublished) ||
        (filterStatus === "draft" && !course.isPublished);

      return matchesSearch && matchesFilter;
    });

    setFilteredCourses(filtered);
  }, [searchTerm, filterStatus, courses]);

  const handleDelete = async (courseId) => {
    // In production, this would show a confirmation dialog
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove course from state after successful deletion
          setCourses(courses.filter((course) => course._id !== courseId));
        } else {
          console.error("Failed to delete course");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleMenu = (courseId) => {
    setMenuOpen(menuOpen === courseId ? null : courseId);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "under-review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/dashboard/instructor"
          className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Manage your course catalog</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/dashboard/instructor/courses/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Course
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                </SelectContent>
              </Select>

              <Select value={showFilters} onValueChange={setShowFilters}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Show Filters</SelectItem>
                  <SelectItem value="false">Hide Filters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
              We couldn't find any courses that match your search criteria.
            </p>
            {searchTerm || filterStatus !== "all" ? (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link href="/dashboard/instructor/courses/create">
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Course
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeClass(
                          course.isPublished ? "published" : "draft"
                        )}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.enrollmentCount || 0}</TableCell>
                    <TableCell>
                      {course.averageRating
                        ? course.averageRating.toFixed(1)
                        : "-"}
                    </TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{formatDate(course.updatedAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/learn/${course.slug}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/instructor/courses/${course._id}/edit`
                              )
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCourseToDelete(course);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the course &quot;
              {courseToDelete?.title}&quot; and all associated content. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(courseToDelete._id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
