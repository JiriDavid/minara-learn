import Link from "next/link";
import { Book, Search, Filter } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Background from "@/components/Background";
import getCourses from "../../lib/GetCourses"

export const metadata = {
  title: "Browse Courses | E-X-TRA LMS",
  description:
    "Browse through our collection of courses and start learning today",
};



export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="container py-10 px-6">
      <Background />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Browse Courses</h1>
          <p className="text-muted-foreground">
            Discover our wide range of courses and start learning today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8 w-[200px] md:w-[300px] text-white"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Book className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No courses found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            There are no courses available at the moment. Please check back
            later.
          </p>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
