"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { ChevronLeft, Play, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { convertMinutesToHours } from "@/lib/utils";

export default function CourseLearnPage({ params }) {
  const { slug } = params;
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);
        // In a real app, fetch from API instead of using mock data
        // const response = await fetch(`/api/courses/${slug}/learn`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockCourse = {
          _id: slug,
          title: "JavaScript Fundamentals",
          description:
            "Learn the fundamentals of JavaScript programming language.",
          lecturerId: "lecturer123",
          lecturerName: "John Doe",
          sections: [
            {
              _id: "section1",
              title: "Getting Started with JavaScript",
              order: 1,
              lessons: [
                {
                  _id: "lesson1",
                  title: "Introduction to JavaScript",
                  description:
                    "An introduction to the JavaScript programming language.",
                  duration: 15,
                  order: 1,
                  videoUrl: "https://example.com/video1.mp4",
                  isCompleted: false,
                },
                {
                  _id: "lesson2",
                  title: "Setting Up Your Development Environment",
                  description:
                    "How to set up your development environment for JavaScript.",
                  duration: 20,
                  order: 2,
                  videoUrl: "https://example.com/video2.mp4",
                  isCompleted: false,
                },
              ],
            },
            {
              _id: "section2",
              title: "JavaScript Basics",
              order: 2,
              lessons: [
                {
                  _id: "lesson3",
                  title: "Variables and Data Types",
                  description:
                    "Learn about variables and data types in JavaScript.",
                  duration: 25,
                  order: 1,
                  videoUrl: "https://example.com/video3.mp4",
                  isCompleted: true,
                },
                {
                  _id: "lesson4",
                  title: "Operators and Expressions",
                  description:
                    "Understanding operators and expressions in JavaScript.",
                  duration: 30,
                  order: 2,
                  videoUrl: "https://example.com/video4.mp4",
                  isCompleted: false,
                },
              ],
            },
          ],
          totalLessons: 4,
        };

        setCourse(mockCourse);

        // Find completed lessons
        const completed = [];
        mockCourse.sections.forEach((section) => {
          section.lessons.forEach((lesson) => {
            if (lesson.isCompleted) {
              completed.push(lesson._id);
            }
          });
        });

        setCompletedLessons(completed);

        // Calculate progress
        const progress = Math.round(
          (completed.length / mockCourse.totalLessons) * 100
        );
        setProgress(progress);

        // Set initial current lesson (either first incomplete or first lesson)
        let foundCurrent = false;

        for (const section of mockCourse.sections) {
          if (foundCurrent) break;

          for (const lesson of section.lessons) {
            if (!lesson.isCompleted) {
              setCurrentSection(section);
              setCurrentLesson(lesson);
              foundCurrent = true;
              break;
            }
          }
        }

        // If all lessons are completed, set to first lesson
        if (
          !foundCurrent &&
          mockCourse.sections.length > 0 &&
          mockCourse.sections[0].lessons.length > 0
        ) {
          setCurrentSection(mockCourse.sections[0]);
          setCurrentLesson(mockCourse.sections[0].lessons[0]);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [slug, userId, isLoaded]);

  const selectLesson = (section, lesson) => {
    setCurrentSection(section);
    setCurrentLesson(lesson);
  };

  const markLessonComplete = async (lessonId) => {
    try {
      // In a real app, you would update this with an API call
      // await fetch(`/api/courses/${slug}/lessons/${lessonId}/complete`, { method: 'POST' });

      // For demo, just update state
      setCompletedLessons((prev) => {
        if (prev.includes(lessonId)) return prev;
        const newCompleted = [...prev, lessonId];

        // Calculate new progress
        const newProgress = Math.round(
          (newCompleted.length / course.totalLessons) * 100
        );
        setProgress(newProgress);

        return newCompleted;
      });
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
    }
  };

  const goToNextLesson = () => {
    if (!currentSection || !currentLesson) return;

    let foundNext = false;
    let nextSection = null;
    let nextLesson = null;

    // Find the next lesson in the current section
    const currentSectionLessons = currentSection.lessons;
    const currentLessonIndex = currentSectionLessons.findIndex(
      (l) => l._id === currentLesson._id
    );

    if (currentLessonIndex < currentSectionLessons.length - 1) {
      // Next lesson is in the same section
      nextSection = currentSection;
      nextLesson = currentSectionLessons[currentLessonIndex + 1];
      foundNext = true;
    } else {
      // Need to move to the next section
      const currentSectionIndex = course.sections.findIndex(
        (s) => s._id === currentSection._id
      );

      if (currentSectionIndex < course.sections.length - 1) {
        nextSection = course.sections[currentSectionIndex + 1];

        if (nextSection.lessons.length > 0) {
          nextLesson = nextSection.lessons[0];
          foundNext = true;
        }
      }
    }

    if (foundNext) {
      setCurrentSection(nextSection);
      setCurrentLesson(nextLesson);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!userId) {
    router.push("/sign-in");
    return null;
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Course Not Found
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          The course you're looking for doesn't exist or you don't have access
          to it.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push("/dashboard/student/courses")}
        >
          Go to My Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/student/courses")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate mx-4">
          {course.title}
        </h1>

        <div className="flex items-center">
          <div className="text-sm text-slate-600 dark:text-slate-400 mr-4">
            Progress: {progress}%
          </div>
          <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Lesson Content */}
        <div className="flex-grow lg:order-1 p-4 lg:p-8">
          {currentLesson ? (
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden bg-black aspect-video">
                {/* This would be a video player in a real app */}
                <div className="h-full w-full flex items-center justify-center text-white">
                  <Play className="h-16 w-16 opacity-50" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  {currentLesson.description}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Duration: {convertMinutesToHours(currentLesson.duration)}
                </div>

                <div className="space-x-3">
                  <Button
                    variant={
                      completedLessons.includes(currentLesson._id)
                        ? "outline"
                        : "primary"
                    }
                    onClick={() => markLessonComplete(currentLesson._id)}
                    disabled={completedLessons.includes(currentLesson._id)}
                  >
                    {completedLessons.includes(currentLesson._id)
                      ? "Completed"
                      : "Mark as Complete"}
                  </Button>

                  <Button onClick={goToNextLesson}>Next Lesson</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Select a lesson to start learning
              </p>
            </div>
          )}
        </div>

        {/* Course Curriculum */}
        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 lg:order-2 overflow-y-auto max-h-[calc(100vh-64px)] lg:sticky lg:top-16">
          <div className="p-4 bg-white dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Course Content
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {course.totalLessons} lessons • {completedLessons.length}{" "}
              completed
            </p>
          </div>

          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={course.sections.map((s) => s._id)}
          >
            {course.sections.map((section) => (
              <AccordionItem key={section._id} value={section._id}>
                <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-900/60">
                  <div className="text-left">
                    <p className="font-medium">
                      Section {section.order}: {section.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {section.lessons.length} lessons
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 py-0">
                  <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                    {section.lessons.map((lesson) => (
                      <li
                        key={lesson._id}
                        className={`
                          px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60
                          ${
                            currentLesson && currentLesson._id === lesson._id
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }
                        `}
                        onClick={() => selectLesson(section, lesson)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3 mt-0.5">
                            {completedLessons.includes(lesson._id) ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Play className="h-5 w-5 text-slate-400" />
                            )}
                          </div>

                          <div className="flex-grow mr-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {convertMinutesToHours(lesson.duration)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
