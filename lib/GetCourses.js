// Function to fetch courses from Supabase
import { getServerSupabaseClient } from "@/lib/supabase";

async function getCourses() {
  try {
    const supabase = getServerSupabaseClient();

    const { data: courses, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        instructor:profiles(name, avatar_url)
      `
      )
      .not("published_at", "is", null)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching courses:", error);
      return [];
    }

    console.log("Fetched courses:", courses);
    return Array.isArray(courses) ? courses : [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export default getCourses;
