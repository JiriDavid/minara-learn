import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      name,
      email,
      title,
      expertise,
      experience,
      education,
      certifications,
      proposedCourses,
      teachingPhilosophy,
      phone,
      linkedin,
      website,
    } = body;

    const supabase = await createClient();

    // Verify the user exists
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create instructor application record
    const { data: application, error: applicationError } = await supabase
      .from('instructor_applications')
      .insert([
        {
          user_id: userId,
          name,
          email,
          title,
          expertise,
          experience,
          education,
          certifications,
          proposed_courses: proposedCourses,
          teaching_philosophy: teachingPhilosophy,
          phone,
          linkedin,
          website,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (applicationError) {
      console.error("Error creating instructor application:", applicationError);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    // Send notification to admins (you can implement email notification here)
    console.log("New instructor application submitted:", application.id);

    return NextResponse.json({
      message: "Application submitted successfully",
      applicationId: application.id,
    });

  } catch (error) {
    console.error("Instructor application error:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}
