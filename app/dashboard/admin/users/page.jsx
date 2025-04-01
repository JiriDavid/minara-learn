"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowUpDown,
  CheckCircle2,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
  UserCog,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminUsersPage() {
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [userToDelete, setUserToDelete] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);
        // In a real app, fetch from API
        // const response = await fetch("/api/admin/users");
        // const data = await response.json();

        // Mock data for demonstration
        const mockUsers = [
          {
            _id: "user1",
            name: "John Doe",
            email: "john@example.com",
            role: "student",
            image: "https://i.pravatar.cc/150?img=1",
            enrolledCourses: 3,
            isVerified: true,
            createdAt: "2023-05-10T08:30:00.000Z",
          },
          {
            _id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "lecturer",
            image: "https://i.pravatar.cc/150?img=2",
            coursesCreated: 5,
            enrollments: 120,
            isVerified: true,
            createdAt: "2023-04-15T14:20:00.000Z",
          },
          {
            _id: "user3",
            name: "Bob Johnson",
            email: "bob@example.com",
            role: "student",
            image: "https://i.pravatar.cc/150?img=3",
            enrolledCourses: 7,
            isVerified: true,
            createdAt: "2023-06-22T11:45:00.000Z",
          },
          {
            _id: "user4",
            name: "Sarah Lee",
            email: "sarah@example.com",
            role: "admin",
            image: "https://i.pravatar.cc/150?img=4",
            isVerified: true,
            createdAt: "2023-03-08T09:10:00.000Z",
          },
          {
            _id: "user5",
            name: "Michael Chen",
            email: "michael@example.com",
            role: "lecturer",
            image: "https://i.pravatar.cc/150?img=5",
            coursesCreated: 2,
            enrollments: 45,
            isVerified: true,
            createdAt: "2023-07-19T16:35:00.000Z",
          },
        ];

        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [userId, isLoaded]);

  // Sort and filter functions
  const filteredUsers = users
    .filter((user) => {
      // Role filter
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort
      const fieldA = a[sortField]?.toString().toLowerCase() || "";
      const fieldB = b[sortField]?.toString().toLowerCase() || "";

      if (sortDirection === "asc") {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // In a real app, make an API call
      // await fetch(`/api/admin/users/${userToDelete}`, {
      //   method: "DELETE",
      // });

      // For demo, just update state
      setUsers(users.filter((user) => user._id !== userToDelete));
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      // In a real app, you would show an error notification
    }
  };

  const handleUpdateUserRole = async () => {
    if (!editUser || !newRole) return;

    try {
      // In a real app, make an API call
      // await fetch(`/api/admin/users/${editUser._id}/role`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ role: newRole }),
      // });

      // For demo, just update state
      setUsers(
        users.map((user) =>
          user._id === editUser._id ? { ...user, role: newRole } : user
        )
      );

      setEditUser(null);
      setNewRole("");
    } catch (error) {
      console.error("Error updating user role:", error);
      // In a real app, you would show an error notification
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          User Management
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          View and manage all users in the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 mr-3 text-blue-500" />
              <span className="text-3xl font-bold">{users.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-8 w-8 mr-3 text-green-500" />
              <span className="text-3xl font-bold">
                {users.filter((user) => user.role === "student").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lecturers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCog className="h-8 w-8 mr-3 text-purple-500" />
              <span className="text-3xl font-bold">
                {users.filter((user) => user.role === "lecturer").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and roles</CardDescription>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-80"
            />

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="lecturer">Lecturers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-500 dark:text-slate-400">
                No users found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("email")}
                      >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("role")}
                      >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("createdAt")}
                      >
                        Joined
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {user.role === "student"
                                ? `${
                                    user.enrolledCourses || 0
                                  } courses enrolled`
                                : user.role === "lecturer"
                                ? `${user.coursesCreated || 0} courses created`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              user.role === "admin"
                                ? "bg-red-500"
                                : user.role === "lecturer"
                                ? "bg-purple-500"
                                : "bg-green-500"
                            }`}
                          />
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <div className="flex items-center text-green-600 dark:text-green-500">
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            <span>Verified</span>
                          </div>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-500">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditUser(user);
                                setNewRole(user.role);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => setUserToDelete(user._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete User Dialog */}
      <Dialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Role Dialog */}
      <Dialog
        open={Boolean(editUser)}
        onOpenChange={(open) => !open && setEditUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {editUser?.name}
            </DialogDescription>
          </DialogHeader>

          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="lecturer">Lecturer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUserRole}
              disabled={!newRole || editUser?.role === newRole}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
