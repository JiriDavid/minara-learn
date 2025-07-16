import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req, { params }) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, lessonId } = params;

    // Find the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if the user is enrolled in the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 400 }
      );
    }

    // Check if lesson already completed
    const { data: existingCompletion, error: completionCheckError } = await supabase
      .from('completions')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    if (existingCompletion) {
      return NextResponse.json({
        message: "Lesson already completed",
        completion: existingCompletion,
      });
    }

    // Create a new completion record
    const { data: completion, error: completionError } = await supabase
      .from('completions')
      .insert([
        {
          user_id: user.id,
          course_id: course.id,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (completionError) {
      console.error("Error creating completion:", completionError);
      return NextResponse.json(
        { error: "Failed to mark lesson as complete" },
        { status: 500 }
      );
    }

    // Update the enrollment progress
    const { count: totalLessons, error: totalLessonsError } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', course.id);

    const { count: completedLessons, error: completedLessonsError } = await supabase
      .from('completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('course_id', course.id);

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Update enrollment progress
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({
        progress: progressPercentage,
        is_completed: progressPercentage === 100,
      })
      .eq('user_id', user.id)
      .eq('course_id', course.id);

    if (updateError) {
      console.error("Error updating enrollment progress:", updateError);
    }

    return NextResponse.json({
      message: "Lesson marked as complete",
      completion: {
        id: completion.id,
        courseId: course.id,
        lessonId: lesson.id,
        completedAt: completion.completed_at,
      },
      progress: progressPercentage,
    });
  } catch (error) {
    console.error("Error marking lesson as complete:", error);
    return NextResponse.json(
      { error: "Failed to mark lesson as complete" },
      { status: 500 }
    );
  }
}
