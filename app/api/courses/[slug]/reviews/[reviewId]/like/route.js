import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// POST - like or unlike a review
export async function POST(req, { params }) {
  const { reviewId } = params;

  if (!reviewId) {
    return NextResponse.json(
      { error: "Review ID is required" },
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

    // Find the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (reviewError || !review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user has already liked this review
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('review_likes')
      .select('*')
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike the review
      const { error: unlikeError } = await supabase
        .from('review_likes')
        .delete()
        .eq('review_id', reviewId)
        .eq('user_id', user.id);

      if (unlikeError) {
        throw unlikeError;
      }

      // Update review likes count
      const { error: updateError } = await supabase
        .from('reviews')
        .update({ likes: Math.max(0, (review.likes || 0) - 1) })
        .eq('id', reviewId);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        likes: Math.max(0, (review.likes || 0) - 1),
        isLikedByUser: false,
      });
    } else {
      // Like the review
      const { error: likeError } = await supabase
        .from('review_likes')
        .insert([
          {
            review_id: reviewId,
            user_id: user.id,
          }
        ]);

      if (likeError) {
        throw likeError;
      }

      // Update review likes count
      const newLikeCount = (review.likes || 0) + 1;
      const { error: updateError } = await supabase
        .from('reviews')
        .update({ likes: newLikeCount })
        .eq('id', reviewId);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        likes: newLikeCount,
        isLikedByUser: true,
      });
    }
  } catch (error) {
    console.error("Error liking review:", error);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}
