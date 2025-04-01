import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDB from "@/lib/database";
import Review from "@/models/Review";

// POST - like or unlike a review
export async function POST(req, { params }) {
  const { reviewId } = params;

  if (!reviewId) {
    return NextResponse.json(
      { error: "Review ID is required" },
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

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const userId = session.user.id;

    // Check if user has already liked this review
    const isLiked = review.likedBy.includes(userId);

    if (isLiked) {
      // Unlike the review
      review.likedBy = review.likedBy.filter((id) => id.toString() !== userId);
      review.likes = Math.max(0, review.likes - 1);
    } else {
      // Like the review
      review.likedBy.push(userId);
      review.likes = (review.likes || 0) + 1;
    }

    await review.save();

    return NextResponse.json({
      likes: review.likes,
      isLikedByUser: !isLiked,
    });
  } catch (error) {
    console.error("Error liking review:", error);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}
