import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDB from "@/lib/database";
import Review from "@/models/Review";
import Course from "@/models/Course";
import User from "@/models/User";

// GET - fetch reviews for a course
export async function GET(req, { params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Course slug is required" },
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    // Find course by slug
    const course = await Course.findOne({ slug });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get session for user identification
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Fetch reviews for this course
    let reviews = await Review.find({ courseId: course._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "name image",
      });

    // Convert reviews to objects and add isLikedByUser
    reviews = reviews.map((review) => {
      const reviewObj = review.toObject();

      // Mark if current user has liked this review
      if (userId) {
        reviewObj.isLikedByUser = reviewObj.likedBy?.includes(userId);
      }

      // Remove likedBy array from response
      delete reviewObj.likedBy;

      return reviewObj;
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - create a new review
export async function POST(req, { params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Course slug is required" },
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
    const { rating, review } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid rating between 1-5 is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find course by slug
    const course = await Course.findOne({ slug });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if user has already reviewed this course
    const existingReview = await Review.findOne({
      courseId: course._id,
      user: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this course" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = new Review({
      courseId: course._id,
      user: session.user.id,
      rating,
      review: review || "",
      likes: 0,
      likedBy: [],
    });

    await newReview.save();

    // Update course ratings
    const reviews = await Review.find({ courseId: course._id });
    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings / reviews.length;

    course.ratings = averageRating;
    course.numReviews = reviews.length;
    await course.save();

    // Populate user info
    const populatedReview = await Review.findById(newReview._id).populate({
      path: "user",
      select: "name image",
    });

    // Convert to object and add isLikedByUser (always false for new review)
    const reviewObj = populatedReview.toObject();
    reviewObj.isLikedByUser = false;
    delete reviewObj.likedBy;

    return NextResponse.json({ review: reviewObj }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
