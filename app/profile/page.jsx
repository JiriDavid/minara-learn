"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import {
  Camera,
  Mail,
  User,
  Cake,
  Edit,
  Loader2,
  School,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    image: "",
    role: "",
    dateOfBirth: "",
    education: "",
    occupation: "",
    socialLinks: {
      website: "",
      linkedin: "",
      twitter: "",
      github: "",
    },
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (loading || !user) return;

        setIsLoading(true);
        // In a real app, fetch from API
        // const response = await fetch("/api/users/me");
        // const data = await response.json();

        // Mock data for demonstration
        const mockProfileData = {
          id: user.id,
          name: user.user_metadata?.full_name || "User",
          email: user.email,
          bio: "Passionate learner and web developer with interests in JavaScript, React, and Node.js.",
          image: "https://placehold.co/200/2563eb/FFFFFF/png?text=JD",
          role: "student",
          dateOfBirth: "1990-01-01",
          education: "Bachelor's in Computer Science",
          occupation: "Software Developer",
          socialLinks: {
            website: "https://johndoe.com",
            linkedin: "https://linkedin.com/in/johndoe",
            twitter: "https://twitter.com/johndoe",
            github: "https://github.com/johndoe",
          },
          enrolledCourses: 5,
          completedCourses: 3,
          certificatesEarned: 3,
          joinedDate: "2023-01-15T00:00:00Z",
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        setProfileData(mockProfileData);
        setFormData({
          name: mockProfileData.name,
          email: mockProfileData.email,
          bio: mockProfileData.bio,
          image: mockProfileData.image,
          role: mockProfileData.role,
          dateOfBirth: mockProfileData.dateOfBirth,
          education: mockProfileData.education,
          occupation: mockProfileData.occupation,
          socialLinks: {
            website: mockProfileData.socialLinks.website,
            linkedin: mockProfileData.socialLinks.linkedin,
            twitter: mockProfileData.socialLinks.twitter,
            github: mockProfileData.socialLinks.github,
          },
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      // In a real app, send to API
      // const response = await fetch("/api/users/me", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData)
      // });

      // if (!response.ok) throw new Error("Failed to update profile");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state with form data
      setProfileData((prev) => ({
        ...prev,
        ...formData,
      }));

      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  if (!profileData) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p>
          We couldn't find your profile information. Please try again later.
        </p>
        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader className="relative">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-28 w-28">
                    <AvatarImage
                      src={profileData.image}
                      alt={profileData.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center">
                  {profileData.name}
                </CardTitle>
                <CardDescription className="text-center">
                  {profileData.email}
                </CardDescription>
                <div className="mt-2 text-center">
                  <Badge className="capitalize">{profileData.role}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      Member since{" "}
                      {new Date(profileData.joinedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      {profileData.education}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      {profileData.occupation}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Social Links</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {profileData.socialLinks.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <a
                          href={profileData.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </a>
                      </Button>
                    )}
                    {profileData.socialLinks.linkedin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <a
                          href={profileData.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {profileData.socialLinks.twitter && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <a
                          href={profileData.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Twitter
                        </a>
                      </Button>
                    )}
                    {profileData.socialLinks.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <a
                          href={profileData.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full" onClick={() => setEditMode(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            {/* Main Content */}
            <div className="md:col-span-2">
              {editMode ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={formData.role || ""}
                            onValueChange={(value) =>
                              handleSelectChange(value, "role")
                            }
                            disabled={
                              profileData.role !== "lecturer" &&
                              profileData.role !== "admin"
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="lecturer">Lecturer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth || ""}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="education">Education</Label>
                          <Input
                            id="education"
                            name="education"
                            value={formData.education || ""}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            name="occupation"
                            value={formData.occupation || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio || ""}
                          onChange={handleInputChange}
                          rows={4}
                        />
                        <p className="text-xs text-slate-500">
                          Brief description for your profile. URLs are
                          hyperlinked.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              name="socialLinks.website"
                              value={formData.socialLinks?.website || ""}
                              onChange={handleInputChange}
                              placeholder="https://example.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              name="socialLinks.linkedin"
                              value={formData.socialLinks?.linkedin || ""}
                              onChange={handleInputChange}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                              id="twitter"
                              name="socialLinks.twitter"
                              value={formData.socialLinks?.twitter || ""}
                              onChange={handleInputChange}
                              placeholder="https://twitter.com/username"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                              id="github"
                              name="socialLinks.github"
                              value={formData.socialLinks?.github || ""}
                              onChange={handleInputChange}
                              placeholder="https://github.com/username"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 whitespace-pre-line">
                        {profileData.bio}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <p className="text-3xl font-bold text-blue-600">
                            {profileData.enrolledCourses}
                          </p>
                          <p className="text-sm text-slate-600">
                            Enrolled Courses
                          </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {profileData.completedCourses}
                          </p>
                          <p className="text-sm text-slate-600">
                            Completed Courses
                          </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <p className="text-3xl font-bold text-amber-600">
                            {profileData.certificatesEarned}
                          </p>
                          <p className="text-sm text-slate-600">
                            Certificates Earned
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/student/courses">
                            View All Courses
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Account settings are managed through Clerk. Click the button
                below to manage your account.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a
                  href="https://clerk.dev/account"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Manage Account
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Manage your privacy settings and data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Privacy settings and data export options will be available here
                in the future.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
