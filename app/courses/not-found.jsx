import Link from "next/link";
import { BookX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourseNotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md text-center">
        <BookX className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3">Course Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The course you're looking for doesn't exist or has been removed.
          Please check the URL or browse our available courses.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/courses">
            <Button className="w-full">Browse Courses</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
