"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Save, Eye, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define form schema
const courseFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  discount: z.coerce.number().min(0, "Discount must be a positive number"),
  category: z.string().min(1, "Category is required"),
  level: z.string().min(1, "Level is required"),
  language: z.string().min(1, "Language is required"),
  published: z.boolean().default(false),
  tags: z.string().optional(),
});

export default function EditCoursePage({ params }) {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form with default values
  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      price: 0,
      discount: 0,
      category: "",
      level: "Beginner",
      language: "English",
      published: false,
      tags: "",
    },
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);
        // In a real app, fetch from API
        // const response = await fetch(`/api/courses/${params.id}`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockCourseData = {
          _id: params.id,
          title: "Advanced Web Development with React and Next.js",
          slug: "advanced-web-development-react-nextjs",
          description:
            "Learn how to build modern web applications using React and Next.js. Master the latest features and best practices for creating fast, responsive, and scalable web applications.",
          thumbnail: "https://placehold.co/800x600",
          price: 99.99,
          discount: 20,
          category: "Web Development",
          level: "Intermediate",
          language: "English",
          published: true,
          tags: ["React", "Next.js", "JavaScript", "Frontend"],
          requirements: [
            "Basic knowledge of HTML, CSS, and JavaScript",
            "Familiarity with React fundamentals",
            "A modern computer with Node.js installed",
          ],
          objectives: [
            "Build complete web applications with React and Next.js",
            "Implement server-side rendering and static site generation",
            "Create responsive and accessible UI components",
            "Manage application state effectively",
            "Connect to APIs and handle data fetching",
            "Deploy applications to production",
          ],
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Set form values
        form.reset({
          title: mockCourseData.title,
          description: mockCourseData.description,
          thumbnail: mockCourseData.thumbnail,
          price: mockCourseData.price,
          discount: mockCourseData.discount,
          category: mockCourseData.category,
          level: mockCourseData.level,
          language: mockCourseData.language,
          published: mockCourseData.published,
          tags: mockCourseData.tags.join(", "),
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [params.id, userId, isLoaded, form]);

  const onSubmit = async (values) => {
    try {
      setIsSaving(true);

      // Process tags if provided
      const processedValues = { ...values };
      if (values.tags) {
        processedValues.tags = values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      } else {
        processedValues.tags = [];
      }

      // In a real app, send to API
      // const response = await fetch(`/api/courses/${params.id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(processedValues),
      // });
      //
      // if (!response.ok) throw new Error("Failed to update course");
      // const data = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      alert("Course updated successfully!");

      setIsSaving(false);
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      // In a real app, send to API
      // const response = await fetch(`/api/courses/${params.id}`, {
      //   method: "DELETE",
      // });
      //
      // if (!response.ok) throw new Error("Failed to delete course");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to courses page
      router.push("/dashboard/instructor/courses");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Course</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/courses/${form
                  .getValues()
                  .title.toLowerCase()
                  .replace(/\s+/g, "-")}`
              )
            }
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="destructive"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="content">Content & Curriculum</TabsTrigger>
          <TabsTrigger value="requirements">
            Requirements & Objectives
          </TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Publication</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>
                    Basic information about your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Course title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your course a clear, descriptive title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Course description"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe what students will learn in this course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of the course thumbnail image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Web Development">
                                Web Development
                              </SelectItem>
                              <SelectItem value="Mobile Development">
                                Mobile Development
                              </SelectItem>
                              <SelectItem value="Data Science">
                                Data Science
                              </SelectItem>
                              <SelectItem value="Machine Learning">
                                Machine Learning
                              </SelectItem>
                              <SelectItem value="DevOps">DevOps</SelectItem>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="Design">Design</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="All Levels">
                                All Levels
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="German">German</SelectItem>
                              <SelectItem value="Chinese">Chinese</SelectItem>
                              <SelectItem value="Japanese">Japanese</SelectItem>
                              <SelectItem value="Hindi">Hindi</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="React, JavaScript, Web Development"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter comma-separated tags to help students find your
                          course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    Manage your course curriculum, sections, and lessons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border p-6 rounded-md flex flex-col items-center justify-center">
                    <p className="mb-4 text-center text-muted-foreground">
                      Go to the course content editor to manage sections and
                      lessons
                    </p>
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/instructor/courses/${params.id}/content`
                        )
                      }
                    >
                      Manage Course Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Objectives</CardTitle>
                  <CardDescription>
                    What students need to know before starting and what they'll
                    learn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border p-6 rounded-md">
                    <h3 className="text-lg font-medium mb-4">Requirements</h3>
                    <p className="text-muted-foreground mb-4">
                      Specify what knowledge or tools students need before
                      starting your course
                    </p>
                    {/* This would be a dynamic list editor in a full implementation */}
                    <Textarea
                      placeholder="Enter each requirement on a new line"
                      className="min-h-32"
                    />
                  </div>

                  <div className="border p-6 rounded-md">
                    <h3 className="text-lg font-medium mb-4">
                      Learning Objectives
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Outline what students will be able to do after completing
                      your course
                    </p>
                    {/* This would be a dynamic list editor in a full implementation */}
                    <Textarea
                      placeholder="Enter each learning objective on a new line"
                      className="min-h-32"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Publication</CardTitle>
                  <CardDescription>
                    Set your course price and publication status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Set your course price in USD
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" {...field} />
                          </FormControl>
                          <FormDescription>
                            Percentage discount off the full price
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            Make this course available to students
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
