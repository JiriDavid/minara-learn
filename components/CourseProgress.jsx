"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight, Clock, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { convertMinutesToHours } from "@/lib/utils";

export default function CourseProgress({
  course,
  enrollment = null,
  showResumeButton = true,
  showCompletedLessons = true,
  className = "",
}) {
  const router = useRouter();
  const [nextLesson, setNextLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    if (!course) return;

    // Calculate total lessons
    let lessonCount = 0;
    course.sections?.forEach((section) => {
      lessonCount += section.lessons?.length || 0;
    });
    setTotalLessons(lessonCount);

    // Set completed lessons from enrollment data
    if (enrollment) {
      setCompletedLessons(enrollment.completedLessons || []);
      setProgress(enrollment.progress || 0);
    }

    // Find the next lesson to continue (first incomplete lesson)
    if (course.sections && course.sections.length > 0) {
      let found = false;

      // Try to find the first incomplete lesson
      for (const section of course.sections) {
        if (found) break;

        for (const lesson of section.lessons || []) {
          if (!enrollment?.completedLessons?.includes(lesson._id)) {
            setNextLesson({
              ...lesson,
              sectionTitle: section.title,
            });
            found = true;
            break;
          }
        }
      }

      // If all lessons are complete or no lessons found, set to first lesson
      if (!found && course.sections[0]?.lessons?.length > 0) {
        setNextLesson({
          ...course.sections[0].lessons[0],
          sectionTitle: course.sections[0].title,
        });
      }
    }
  }, [course, enrollment]);

  const resumeCourse = () => {
    if (nextLesson) {
      router.push(`/learn/${course.slug}?lesson=${nextLesson._id}`);
    } else {
      router.push(`/learn/${course.slug}`);
    }
  };

  if (!course) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {completedLessons.length} of {totalLessons} lessons completed
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Next lesson */}
        {nextLesson && (
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Continue Learning</h4>
              <Badge variant="outline" className="text-xs">
                {progress === 100 ? "Completed" : "In Progress"}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              {nextLesson.sectionTitle}
            </p>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{nextLesson.title}</p>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3 mr-1" />
                {convertMinutesToHours(nextLesson.duration)}
              </div>
            </div>
          </div>
        )}

        {/* Completed lessons list */}
        {showCompletedLessons && completedLessons.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recently Completed</h4>
            <ul className="space-y-2">
              {completedLessons.slice(0, 3).map((lessonId) => {
                // Find the lesson in the course
                let lesson = null;
                let sectionTitle = "";

                for (const section of course.sections || []) {
                  const found = (section.lessons || []).find(
                    (l) => l._id === lessonId
                  );
                  if (found) {
                    lesson = found;
                    sectionTitle = section.title;
                    break;
                  }
                }

                if (!lesson) return null;

                return (
                  <li key={lessonId} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{lesson.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {sectionTitle}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>

      {showResumeButton && (
        <CardFooter>
          <Button className="w-full" onClick={resumeCourse}>
            {progress === 0 ? "Start Learning" : "Resume Course"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
