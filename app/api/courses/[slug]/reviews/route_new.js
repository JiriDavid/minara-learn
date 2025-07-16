import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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
    const supabase = await createClient();

    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Get reviews with user information
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!inner(name, email, avatar_url)
      `)
      .eq('course_id', course.id)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      throw reviewsError;
    }

    return NextResponse.json({
      reviews: reviews || [],
      totalReviews: reviews?.length || 0,
    });
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

    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user is enrolled in the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: "You must be enrolled in the course to leave a review" },
        { status: 403 }
      );
    }

    // Check if user has already reviewed this course
    const { data: existingReview, error: existingReviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this course" },
        { status: 400 }
      );
    }

    // Create the review
    const { data: newReview, error: reviewError } = await supabase
      .from('reviews')
      .insert([
        {
          user_id: user.id,
          course_id: course.id,
          rating: rating,
          review: review || "",
          created_at: new Date().toISOString(),
        }
      ])
      .select(`
        *,
        profiles!inner(name, email, avatar_url)
      `)
      .single();

    if (reviewError) {
      throw reviewError;
    }

    // Update course average rating
    const { data: allReviews, error: allReviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('course_id', course.id);

    if (allReviews && allReviews.length > 0) {
      const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRatings / allReviews.length;

      await supabase
        .from('courses')
        .update({ 
          average_rating: averageRating,
          total_reviews: allReviews.length
        })
        .eq('id', course.id);
    }

    return NextResponse.json({
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
