"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Book } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import CourseFilters from "@/components/CourseFilters";
import { Button } from "@/components/ui/button";
import Background from "@/components/Background"

export default function CoursesClientPage({
  initialCourses,
  filterMetadata,
  searchParams,
}) {
  const [courses, setCourses] = useState(initialCourses || []);
  const [isLoading, setIsLoading] = useState(false);

  // Handle filter changes
  const handleFilterChange = async (filters) => {
    setIsLoading(true);
    // No need to fetch data here - Next.js will handle the navigation via the URL
    // and the server component will fetch the filtered data
    setIsLoading(false);
  };

  // Render the empty state when no courses match the filter criteria
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Book className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">No courses found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any courses matching your criteria. Try adjusting your
        filters or search query.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/courses">
          <Button>View All Courses</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );

  // Display loading state or skeleton while fetching
  if (isLoading) {
    return (
      <div>
        <CourseFilters
          onFilterChange={handleFilterChange}
          initialFilters={searchParams}
          metadata={filterMetadata}
        />
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"
                ></div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Background/>
      <CourseFilters
        onFilterChange={handleFilterChange}
        initialFilters={searchParams}
        metadata={filterMetadata}
      />

      {courses.length > 0 ? (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{courses.length}</span>{" "}
              {courses.length === 1 ? "course" : "courses"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
