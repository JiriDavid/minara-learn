import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";

export default function CourseGrid({ courses = [] }) {
  // Handle empty state
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No courses found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          We couldn't find any courses matching your criteria. Please try
          different filters or check back later.
        </p>
        <Button variant="outline">Clear Filters</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-600 dark:text-slate-400">
          Showing <span className="font-medium">{courses.length}</span> courses
        </p>
        <div className="flex items-center space-x-2">
          <label
            htmlFor="sort"
            className="text-sm text-slate-600 dark:text-slate-400"
          >
            Sort by:
          </label>
          <select
            id="sort"
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm py-1 px-3"
            defaultValue="newest"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {courses.length > 10 && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" className="mr-2">
            Previous
          </Button>
          <Button variant="outline">Next</Button>
        </div>
      )}
    </div>
  );
}
