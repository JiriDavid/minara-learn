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

    await connectToDB();

    // Find review and ensure it belongs to the user
    const reviewToUpdate = await Review.findOne({
      _id: reviewId,
      user: session.user.id,
    });

    if (!reviewToUpdate) {
      return NextResponse.json(
        { error: "Review not found or not owned by you" },
        { status: 404 }
      );
    }

    // Update review
    reviewToUpdate.rating = rating;
    reviewToUpdate.review = review || "";
    reviewToUpdate.updatedAt = new Date();

    await reviewToUpdate.save();

    // Update course ratings
    const course = await Course.findById(reviewToUpdate.courseId);
    if (course) {
      const reviews = await Review.find({ courseId: course._id });
      const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRatings / reviews.length;

      course.ratings = averageRating;
      await course.save();
    }

    // Populate user info
    const populatedReview = await Review.findById(reviewId).populate({
      path: "user",
      select: "name image",
    });

    // Convert to object and add isLikedByUser
    const reviewObj = populatedReview.toObject();
    reviewObj.isLikedByUser = reviewObj.likedBy?.includes(session.user.id);
    delete reviewObj.likedBy;

    return NextResponse.json({ review: reviewObj });
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

  // Get session data
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    await connectToDB();

    // Find review and ensure it belongs to the user
    const reviewToDelete = await Review.findOne({
      _id: reviewId,
      user: session.user.id,
    });

    if (!reviewToDelete) {
      return NextResponse.json(
        { error: "Review not found or not owned by you" },
        { status: 404 }
      );
    }

    // Delete review
    await Review.deleteOne({ _id: reviewId });

    // Update course ratings
    const course = await Course.findById(reviewToDelete.courseId);
    if (course) {
      const reviews = await Review.find({ courseId: course._id });

      if (reviews.length === 0) {
        course.ratings = 0;
        course.numReviews = 0;
      } else {
        const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRatings / reviews.length;

        course.ratings = averageRating;
        course.numReviews = reviews.length;
      }

      await course.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
