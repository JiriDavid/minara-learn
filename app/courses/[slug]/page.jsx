// Server component
import { notFound } from "next/navigation";
import { getServerSupabaseClient } from "@/lib/supabase";
import CoursePageClient from "./course-client.jsx";
import Background from "@/components/Background"

// Metadata for the page
export async function generateMetadata({ params }) {
  const supabase = getServerSupabaseClient();

  const { data: course } = await supabase
    .from("courses")
    .select(
      `
      *,
      lecturer:profiles(name, avatar_url)
    `
    )
    .eq("slug", params.slug)
    .single();

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} | Minara Learn`,
    description: course.description,
  };
}

// Default export
export default async function CoursePage({ params }) {
  const supabase = getServerSupabaseClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      lecturer:profiles(name, avatar_url),
      lessons(*),
      reviews(
        *,
        user:profiles(name, avatar_url)
      )
    `
    )
    .eq("slug", params.slug)
    .single();

  if (error || !course) {
    notFound();
  }

  // Pass the course data to the client component
  return (
    <>
      <Background />
      <CoursePageClient course={course} />
    </>
  );
}
