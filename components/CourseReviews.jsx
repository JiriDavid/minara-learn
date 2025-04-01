"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, ThumbsUp, User } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CourseReviews({ courseId, ratings, numReviews }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/courses/${courseId}/reviews`);

        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();
        setReviews(data.reviews || []);

        // Find user's review if exists
        if (session?.user) {
          const userReview = data.reviews.find(
            (review) => review.user._id === session.user.id
          );
          if (userReview) {
            setUserReview(userReview);
            setUserRating(userReview.rating);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [courseId, session]);

  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  const handleRatingHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!session) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);

      const method = userReview ? "PUT" : "POST";
      const endpoint = userReview
        ? `/api/courses/${courseId}/reviews/${userReview._id}`
        : `/api/courses/${courseId}/reviews`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: userRating,
          review: newReview.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      const data = await res.json();

      // Update reviews list
      if (userReview) {
        setReviews(
          reviews.map((review) =>
            review._id === userReview._id ? data.review : review
          )
        );
        setUserReview(data.review);
      } else {
        setReviews([data.review, ...reviews]);
        setUserReview(data.review);
      }

      setNewReview("");
      toast.success(userReview ? "Review updated" : "Review submitted");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!session) {
      toast.error("Please sign in to like reviews");
      return;
    }

    try {
      const res = await fetch(
        `/api/courses/${courseId}/reviews/${reviewId}/like`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("Failed to like review");

      const data = await res.json();

      // Update reviews list
      setReviews(
        reviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                likes: data.likes,
                isLikedByUser: data.isLikedByUser,
              }
            : review
        )
      );

      // If it's the user's review, update userReview state
      if (userReview && userReview._id === reviewId) {
        setUserReview({
          ...userReview,
          likes: data.likes,
          isLikedByUser: data.isLikedByUser,
        });
      }
    } catch (error) {
      console.error("Error liking review:", error);
      toast.error("Failed to like review");
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-slate-500 dark:text-slate-400">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Student Reviews
        </h2>
        <div className="flex items-center">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= ratings
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-lg">{ratings.toFixed(1)}</span>
          <span className="text-slate-500 dark:text-slate-400 ml-1">
            ({numReviews} reviews)
          </span>
        </div>
      </div>

      {/* Submit review form */}
      {session && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">
            {userReview ? "Edit Your Review" : "Write a Review"}
          </h3>

          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => handleRatingHover(star)}
                onMouseLeave={() => handleRatingHover(0)}
                onClick={() => handleRatingClick(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || userRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Share your experience with this course..."
            value={newReview || userReview?.review || ""}
            onChange={(e) => setNewReview(e.target.value)}
            rows={4}
            className="mb-3"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSubmitReview}
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : userReview
                ? "Update Review"
                : "Submit Review"}
            </Button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {review.user.image ? (
                      <img
                        src={review.user.image}
                        alt={review.user.name}
                        className="rounded-full h-10 w-10"
                      />
                    ) : (
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-10 w-10 flex items-center justify-center">
                        <User className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {review.user.name}
                      </p>
                      {review.user._id === session?.user?.id && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 py-0.5 px-1.5 rounded">
                          You
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mt-1">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleLikeReview(review._id)}
                  className={`flex items-center text-xs ${
                    review.isLikedByUser
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  disabled={!session}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{review.likes || 0}</span>
                </button>
              </div>

              {review.review && (
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  {review.review}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-slate-500 dark:text-slate-400">
          No reviews yet. Be the first to leave a review!
        </div>
      )}
    </div>
  );
}
