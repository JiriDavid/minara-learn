"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Plus,
  Trash,
  Pencil,
  Save,
  X,
  GripVertical,
  BookOpen,
  Play,
  FileText,
  LayoutGrid,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertMinutesToHours } from "@/lib/utils";

export default function CourseContentPage({ params }) {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);

  // For adding/editing sections
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [sectionFormMode, setSectionFormMode] = useState("add");
  const [sectionToEdit, setSectionToEdit] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  // For adding/editing lessons
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonFormMode, setLessonFormMode] = useState("add");
  const [lessonToEdit, setLessonToEdit] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [newLessonData, setNewLessonData] = useState({
    title: "",
    type: "video",
    content: "",
    duration: 0,
  });

  // Fetch course data including sections and lessons
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);
        // In a real app, fetch from API
        // const response = await fetch(`/api/courses/${params.id}/content`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockCourseData = {
          _id: params.id,
          title: "Advanced Web Development with React and Next.js",
          slug: "advanced-web-development-react-nextjs",
          sections: [
            {
              _id: "section1",
              title: "Introduction to React and Next.js",
              order: 1,
              lessons: [
                {
                  _id: "lesson1-1",
                  title: "Course Overview",
                  type: "video",
                  content: "https://example.com/videos/course-overview",
                  duration: 10,
                  order: 1,
                  isPublished: true,
                },
                {
                  _id: "lesson1-2",
                  title: "Setting Up Your Development Environment",
                  type: "video",
                  content: "https://example.com/videos/dev-environment",
                  duration: 15,
                  order: 2,
                  isPublished: true,
                },
              ],
            },
            {
              _id: "section2",
              title: "Building Your First React Application",
              order: 2,
              lessons: [
                {
                  _id: "lesson2-1",
                  title: "Creating React Components",
                  type: "video",
                  content: "https://example.com/videos/react-components",
                  duration: 20,
                  order: 1,
                  isPublished: true,
                },
                {
                  _id: "lesson2-2",
                  title: "State and Props",
                  type: "video",
                  content: "https://example.com/videos/state-props",
                  duration: 25,
                  order: 2,
                  isPublished: true,
                },
                {
                  _id: "lesson2-3",
                  title: "Hooks in React",
                  type: "video",
                  content: "https://example.com/videos/react-hooks",
                  duration: 30,
                  order: 3,
                  isPublished: false,
                },
              ],
            },
          ],
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Set course data
        setCourse(mockCourseData);
        setSections(mockCourseData.sections);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course content:", error);
        setIsLoading(false);
      }
    };

    fetchCourseContent();
  }, [params.id, userId, isLoaded]);

  // Calculate total course duration
  const calculateTotalDuration = () => {
    return sections.reduce((total, section) => {
      return (
        total +
        section.lessons.reduce((sectionTotal, lesson) => {
          return sectionTotal + (lesson.duration || 0);
        }, 0)
      );
    }, 0);
  };

  // Count total lessons
  const countTotalLessons = () => {
    return sections.reduce((total, section) => {
      return total + section.lessons.length;
    }, 0);
  };

  // Handle section form submission
  const handleSectionSubmit = async (e) => {
    e.preventDefault();

    if (!newSectionTitle.trim()) return;

    if (sectionFormMode === "add") {
      // Add new section
      const newSection = {
        _id: `temp-${Date.now()}`, // In a real app, this would be assigned by the backend
        title: newSectionTitle,
        order: sections.length + 1,
        lessons: [],
      };

      setSections([...sections, newSection]);

      // In a real app, send to API
      // await fetch(`/api/courses/${params.id}/sections`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ title: newSectionTitle }),
      // });
    } else if (sectionFormMode === "edit" && sectionToEdit) {
      // Update existing section
      const updatedSections = sections.map((section) => {
        if (section._id === sectionToEdit._id) {
          return { ...section, title: newSectionTitle };
        }
        return section;
      });

      setSections(updatedSections);

      // In a real app, send to API
      // await fetch(`/api/courses/${params.id}/sections/${sectionToEdit._id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ title: newSectionTitle }),
      // });
    }

    // Reset form
    setNewSectionTitle("");
    setShowSectionForm(false);
    setSectionToEdit(null);
  };

  // Handle section deletion
  const handleDeleteSection = async (sectionId) => {
    const updatedSections = sections.filter(
      (section) => section._id !== sectionId
    );
    setSections(updatedSections);

    // In a real app, send to API
    // await fetch(`/api/courses/${params.id}/sections/${sectionId}`, {
    //   method: "DELETE",
    // });
  };

  // Handle lesson form submission
  const handleLessonSubmit = async (e) => {
    e.preventDefault();

    if (!newLessonData.title.trim() || !activeSectionId) return;

    if (lessonFormMode === "add") {
      // Add new lesson
      const updatedSections = sections.map((section) => {
        if (section._id === activeSectionId) {
          const newLesson = {
            _id: `temp-lesson-${Date.now()}`, // In a real app, this would be assigned by the backend
            ...newLessonData,
            order: section.lessons.length + 1,
            isPublished: true,
          };

          return {
            ...section,
            lessons: [...section.lessons, newLesson],
          };
        }
        return section;
      });

      setSections(updatedSections);

      // In a real app, send to API
      // await fetch(`/api/courses/${params.id}/sections/${activeSectionId}/lessons`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newLessonData),
      // });
    } else if (lessonFormMode === "edit" && lessonToEdit) {
      // Update existing lesson
      const updatedSections = sections.map((section) => {
        if (section._id === activeSectionId) {
          const updatedLessons = section.lessons.map((lesson) => {
            if (lesson._id === lessonToEdit._id) {
              return { ...lesson, ...newLessonData };
            }
            return lesson;
          });

          return { ...section, lessons: updatedLessons };
        }
        return section;
      });

      setSections(updatedSections);

      // In a real app, send to API
      // await fetch(`/api/courses/${params.id}/sections/${activeSectionId}/lessons/${lessonToEdit._id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newLessonData),
      // });
    }

    // Reset form
    setNewLessonData({
      title: "",
      type: "video",
      content: "",
      duration: 0,
    });
    setShowLessonForm(false);
    setLessonToEdit(null);
    setActiveSectionId(null);
  };

  // Handle lesson deletion
  const handleDeleteLesson = async (sectionId, lessonId) => {
    const updatedSections = sections.map((section) => {
      if (section._id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter((lesson) => lesson._id !== lessonId),
        };
      }
      return section;
    });

    setSections(updatedSections);

    // In a real app, send to API
    // await fetch(`/api/courses/${params.id}/sections/${sectionId}/lessons/${lessonId}`, {
    //   method: "DELETE",
    // });
  };

  // Open the section form for adding
  const openAddSectionForm = () => {
    setSectionFormMode("add");
    setSectionToEdit(null);
    setNewSectionTitle("");
    setShowSectionForm(true);
  };

  // Open the section form for editing
  const openEditSectionForm = (section) => {
    setSectionFormMode("edit");
    setSectionToEdit(section);
    setNewSectionTitle(section.title);
    setShowSectionForm(true);
  };

  // Open the lesson form for adding
  const openAddLessonForm = (sectionId) => {
    setLessonFormMode("add");
    setLessonToEdit(null);
    setActiveSectionId(sectionId);
    setNewLessonData({
      title: "",
      type: "video",
      content: "",
      duration: 0,
    });
    setShowLessonForm(true);
  };

  // Open the lesson form for editing
  const openEditLessonForm = (sectionId, lesson) => {
    setLessonFormMode("edit");
    setLessonToEdit(lesson);
    setActiveSectionId(sectionId);
    setNewLessonData({
      title: lesson.title,
      type: lesson.type,
      content: lesson.content,
      duration: lesson.duration,
    });
    setShowLessonForm(true);
  };

  // Save all changes to the course content
  const saveAllChanges = async () => {
    try {
      setIsSaving(true);

      // In a real app, send all changes to API
      // const response = await fetch(`/api/courses/${params.id}/content`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ sections }),
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Course content saved successfully!");
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving course content:", error);
      alert("Failed to save course content. Please try again.");
      setIsSaving(false);
    }
  };

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading course content...</p>
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
          <div>
            <h1 className="text-2xl font-bold">{course?.title}</h1>
            <p className="text-muted-foreground">
              {countTotalLessons()} lessons ·{" "}
              {convertMinutesToHours(calculateTotalDuration())}
            </p>
          </div>
        </div>
        <Button onClick={saveAllChanges} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Course Curriculum</h2>
        <Button onClick={openAddSectionForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      {/* Course Sections */}
      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="border rounded-md p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Your course doesn't have any sections yet.
            </p>
            <Button onClick={openAddSectionForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Section
            </Button>
          </div>
        ) : (
          sections.map((section, index) => (
            <Card key={section._id} className="group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 cursor-grab opacity-0 group-hover:opacity-100 transition">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">
                      Section {index + 1}: {section.title}
                    </CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditSectionForm(section)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSection(section._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {section.lessons.length}{" "}
                  {section.lessons.length === 1 ? "lesson" : "lessons"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {section.lessons.length === 0 ? (
                  <div className="text-center py-4 border border-dashed rounded-md">
                    <p className="text-muted-foreground mb-2">
                      No lessons in this section yet
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddLessonForm(section._id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lesson
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson._id}
                        className="flex items-center justify-between p-3 border rounded-md group/lesson hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="cursor-grab opacity-0 group-hover/lesson:opacity-100 transition">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                            {lessonIndex + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm">
                                {lesson.title}
                              </h3>
                              {!lesson.isPublished && (
                                <Badge variant="outline" className="text-xs">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                {lesson.type === "video" ? (
                                  <Play className="h-3 w-3 mr-1" />
                                ) : lesson.type === "text" ? (
                                  <FileText className="h-3 w-3 mr-1" />
                                ) : (
                                  <LayoutGrid className="h-3 w-3 mr-1" />
                                )}
                                {lesson.type}
                              </div>
                              <div>{lesson.duration} min</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover/lesson:opacity-100 transition">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              openEditLessonForm(section._id, lesson)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleDeleteLesson(section._id, lesson._id)
                            }
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => openAddLessonForm(section._id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lesson
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Section Form Dialog */}
      <Dialog open={showSectionForm} onOpenChange={setShowSectionForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {sectionFormMode === "add" ? "Add New Section" : "Edit Section"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSectionSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="sectionTitle" className="text-sm font-medium">
                  Section Title
                </label>
                <Input
                  id="sectionTitle"
                  placeholder="e.g., Introduction to the Course"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSectionForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lesson Form Dialog */}
      <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {lessonFormMode === "add" ? "Add New Lesson" : "Edit Lesson"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLessonSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="lessonTitle" className="text-sm font-medium">
                  Lesson Title
                </label>
                <Input
                  id="lessonTitle"
                  placeholder="e.g., Introduction to React Hooks"
                  value={newLessonData.title}
                  onChange={(e) =>
                    setNewLessonData({
                      ...newLessonData,
                      title: e.target.value,
                    })
                  }
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lessonType" className="text-sm font-medium">
                  Lesson Type
                </label>
                <Select
                  value={newLessonData.type}
                  onValueChange={(value) =>
                    setNewLessonData({ ...newLessonData, type: value })
                  }
                >
                  <SelectTrigger id="lessonType">
                    <SelectValue placeholder="Select lesson type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="lessonContent" className="text-sm font-medium">
                  {newLessonData.type === "video"
                    ? "Video URL"
                    : newLessonData.type === "text"
                    ? "Text Content"
                    : "Quiz Data"}
                </label>
                {newLessonData.type === "text" ? (
                  <Textarea
                    id="lessonContent"
                    placeholder="Enter lesson content..."
                    value={newLessonData.content}
                    onChange={(e) =>
                      setNewLessonData({
                        ...newLessonData,
                        content: e.target.value,
                      })
                    }
                    className="min-h-32"
                  />
                ) : (
                  <Input
                    id="lessonContent"
                    placeholder={
                      newLessonData.type === "video"
                        ? "https://example.com/video"
                        : "Quiz data reference"
                    }
                    value={newLessonData.content}
                    onChange={(e) =>
                      setNewLessonData({
                        ...newLessonData,
                        content: e.target.value,
                      })
                    }
                  />
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lessonDuration" className="text-sm font-medium">
                  Duration (minutes)
                </label>
                <Input
                  id="lessonDuration"
                  type="number"
                  min="0"
                  placeholder="e.g., 15"
                  value={newLessonData.duration}
                  onChange={(e) =>
                    setNewLessonData({
                      ...newLessonData,
                      duration: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLessonForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
