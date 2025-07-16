import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// PUT - update a review
export async function PUT(req, { params }) {
  const { slug, reviewId } = params;

  if (!slug || !reviewId) {
    return NextResponse.json(
      { error: "Course slug and review ID are required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { rating, review } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid rating between 1-5 is required" },
        { status: 400 }
      );
    }

    // Find review and ensure it belongs to the user
    const { data: reviewToUpdate, error: reviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .eq('user_id', user.id)
      .single();

    if (reviewError || !reviewToUpdate) {
      return NextResponse.json(
        { error: "Review not found or not owned by you" },
        { status: 404 }
      );
    }

    // Update review
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({
        rating: rating,
        review: review || "",
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    // Update course ratings
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', reviewToUpdate.course_id)
      .single();

    if (course) {
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('course_id', course.id);

      if (reviews && reviews.length > 0) {
        const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRatings / reviews.length;

        await supabase
          .from('courses')
          .update({ average_rating: averageRating })
          .eq('id', course.id);
      }
    }

    return NextResponse.json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE - delete a review
export async function DELETE(req, { params }) {
  const { slug, reviewId } = params;

  if (!slug || !reviewId) {
    return NextResponse.json(
      { error: "Course slug and review ID are required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find review and ensure it belongs to the user
    const { data: reviewToDelete, error: reviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .eq('user_id', user.id)
      .single();

    if (reviewError || !reviewToDelete) {
      return NextResponse.json(
        { error: "Review not found or not owned by you" },
        { status: 404 }
      );
    }

    // Delete review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (deleteError) {
      throw deleteError;
    }

    // Update course ratings
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', reviewToDelete.course_id)
      .single();

    if (course) {
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('course_id', course.id);

      if (reviews && reviews.length > 0) {
        const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRatings / reviews.length;

        await supabase
          .from('courses')
          .update({ average_rating: averageRating })
          .eq('id', course.id);
      } else {
        await supabase
          .from('courses')
          .update({ average_rating: 0 })
          .eq('id', course.id);
      }
    }

    return NextResponse.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
