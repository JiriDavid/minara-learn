import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify user has student role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profile?.role !== 'student' && profile?.role !== 'admin')) {
      return new NextResponse("Forbidden - Student access required", { status: 403 });
    }

    // Since we don't have a dedicated activity table yet, we'll generate activity
    // from existing data sources: enrollments, certificates, etc.
    
    const activities = [];

    // Get recent enrollments (course starts)
    const { data: recentEnrollments, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select(`
        id,
        created_at,
        course:courses(title, slug)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!enrollmentsError && recentEnrollments) {
      recentEnrollments.forEach(enrollment => {
        activities.push({
          id: `enrollment_${enrollment.id}`,
          type: "course_started",
          course: enrollment.course.title,
          detail: "",
          date: enrollment.created_at,
          icon: "play",
        });
      });
    }

    // Get certificates (course completions)
    const { data: certificates, error: certificatesError } = await supabase
      .from("certificates")
      .select(`
        id,
        issued_at,
        course:courses(title, slug)
      `)
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false })
      .limit(5);

    if (!certificatesError && certificates) {
      certificates.forEach(certificate => {
        activities.push({
          id: `certificate_${certificate.id}`,
          type: "certificate_earned",
          course: certificate.course.title,
          detail: "",
          date: certificate.issued_at,
          icon: "award",
        });
      });
    }

    // Get completed courses (from enrollments with 100% progress)
    const { data: completedCourses, error: completedError } = await supabase
      .from("enrollments")
      .select(`
        id,
        updated_at,
        course:courses(title, slug)
      `)
      .eq("user_id", user.id)
      .eq("progress", 100)
      .order("updated_at", { ascending: false })
      .limit(5);

    if (!completedError && completedCourses) {
      completedCourses.forEach(enrollment => {
        // Only add if we don't already have a certificate for this course
        const hasCertificate = activities.some(
          activity => activity.type === "certificate_earned" && 
          activity.course === enrollment.course.title
        );
        
        if (!hasCertificate) {
          activities.push({
            id: `completed_${enrollment.id}`,
            type: "course_completed",
            course: enrollment.course.title,
            detail: "",
            date: enrollment.updated_at,
            icon: "check",
          });
        }
      });
    }

    // Sort all activities by date (most recent first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Return the most recent 10 activities
    const recentActivities = activities.slice(0, 10);

    return NextResponse.json(recentActivities);
  } catch (error) {
    console.error("Error in activity endpoint:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
