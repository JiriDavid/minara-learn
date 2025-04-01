"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Play, Lock, Clock } from "lucide-react";
import { convertMinutesToHours } from "@/lib/utils";

export default function CourseSections({ sections = [] }) {
  const [openSections, setOpenSections] = useState(
    sections.length === 1 ? [sections[0]._id] : []
  );

  const toggleSection = (sectionId) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (sections.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No content available for this course yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isOpen = openSections.includes(section._id);
        const totalLessons = section.lessons ? section.lessons.length : 0;
        const totalDuration = section.lessons
          ? section.lessons.reduce(
              (total, lesson) => total + (lesson.duration || 0),
              0
            )
          : 0;

        return (
          <div
            key={section._id}
            className="border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section._id)}
              className="flex justify-between items-center w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="flex-grow">
                <h3 className="font-medium text-slate-900 dark:text-white">
                  Section {section.order}: {section.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {totalLessons} lessons •{" "}
                  {convertMinutesToHours(totalDuration)}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {isOpen && section.lessons && section.lessons.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                  >
                    <div className="mr-3 text-slate-400 dark:text-slate-500">
                      {lesson.isPreview ? (
                        <Play size={18} className="text-blue-500" />
                      ) : (
                        <Lock size={18} />
                      )}
                    </div>

                    <div className="flex-grow mr-4">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                        {lesson.title}
                      </h4>
                    </div>

                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Clock size={14} className="mr-1" />
                      {lesson.duration
                        ? convertMinutesToHours(lesson.duration)
                        : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
