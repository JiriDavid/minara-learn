"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Loader2,
  ArrowLeft,
  Upload,
  Plus,
  Trash,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  slug: z
    .string()
    .min(5, {
      message: "Slug must be at least 5 characters.",
    })
    .max(100, {
      message: "Slug must not exceed 100 characters.",
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must contain only lowercase letters, numbers, and hyphens.",
    }),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  level: z.string({
    required_error: "Please select a difficulty level.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a non-negative number.",
  }),
  imageUrl: z
    .string()
    .url({
      message: "Please enter a valid URL for the course image.",
    })
    .optional(),
});

export default function CreateCourse() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // null, 'success', 'error'
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    level: "beginner",
    category: "",
    price: "",
    duration: "",
    image: null,
    sections: [
      {
        title: "Section 1",
        lessons: [
          { title: "Lesson 1", type: "video", duration: "", content: "" },
        ],
      },
    ],
  });

  // Initialize form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      level: "",
      price: 0,
      imageUrl: "",
    },
  });

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (e) => {
    const title = e.target.value;
    form.setValue("title", title);

    // Only auto-generate slug if user hasn't manually edited it
    if (
      !form.getValues("slug") ||
      form.getValues("slug") === generateSlug(form.getValues("title"))
    ) {
      form.setValue("slug", generateSlug(title));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          title: `Section ${formData.sections.length + 1}`,
          lessons: [
            { title: "Lesson 1", type: "video", duration: "", content: "" },
          ],
        },
      ],
    });
  };

  const removeSection = (sectionIndex) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, index) => index !== sectionIndex),
    });
  };

  const updateSectionTitle = (sectionIndex, title) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].title = title;
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const addLesson = (sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons.push({
      title: `Lesson ${updatedSections[sectionIndex].lessons.length + 1}`,
      type: "video",
      duration: "",
      content: "",
    });
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons = updatedSections[
      sectionIndex
    ].lessons.filter((_, idx) => idx !== lessonIndex);
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const updateLessonDetail = (sectionIndex, lessonIndex, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons[lessonIndex][field] = value;
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // This is where you would typically submit to your API
      // const response = await fetch('/api/courses', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) throw new Error('Failed to create course');

      setFormStatus("success");

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/instructor/courses");
      }, 2000);
    } catch (error) {
      console.error("Error creating course:", error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/instructor/courses"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to courses
        </Link>
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to create your new course
        </p>
      </div>

      {formStatus === "success" && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300">
              Course created successfully!
            </h3>
            <p className="text-green-700 dark:text-green-400 text-sm mt-1">
              Your course has been created. You will be redirected to the
              courses page shortly.
            </p>
          </div>
        </div>
      )}

      {formStatus === "error" && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-300">
              Failed to create course
            </h3>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">
              There was an error creating your course. Please try again.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course Basic Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Course Information</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium mb-1"
              >
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="level"
                  className="block text-sm font-medium mb-1"
                >
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-1"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1"
                >
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium mb-1"
                >
                  Estimated Duration (hours){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-1">
                Course Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Course thumbnail preview"
                      className="h-32 w-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: null })}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md hover:border-primary flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Upload thumbnail
                    </span>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                      required={!formData.image}
                    />
                    <span className="mt-1 text-xs text-gray-400">
                      Recommended: 1280×720px
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Course Content</h2>

          <div className="space-y-6">
            {formData.sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSectionTitle(sectionIndex, e.target.value)
                      }
                      className="font-medium text-lg w-full border-none focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
                      placeholder="Section Title"
                    />
                  </div>
                  {formData.sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Lessons */}
                <div className="space-y-4 ml-4">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            updateLessonDetail(
                              sectionIndex,
                              lessonIndex,
                              "title",
                              e.target.value
                            )
                          }
                          className="font-medium w-full border-none focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
                          placeholder="Lesson Title"
                        />
                        {section.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeLesson(sectionIndex, lessonIndex)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div>
                          <select
                            value={lesson.type}
                            onChange={(e) =>
                              updateLessonDetail(
                                sectionIndex,
                                lessonIndex,
                                "type",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="video">Video</option>
                            <option value="text">Text</option>
                            <option value="quiz">Quiz</option>
                            <option value="assignment">Assignment</option>
                          </select>
                        </div>

                        <div>
                          <input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) =>
                              updateLessonDetail(
                                sectionIndex,
                                lessonIndex,
                                "duration",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Duration (minutes)"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <textarea
                          value={lesson.content}
                          onChange={(e) =>
                            updateLessonDetail(
                              sectionIndex,
                              lessonIndex,
                              "content",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder={
                            lesson.type === "video"
                              ? "Video URL"
                              : "Lesson content"
                          }
                          rows="2"
                        ></textarea>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addLesson(sectionIndex)}
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lesson
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard/instructor/courses"
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-primary text-white rounded-md ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
