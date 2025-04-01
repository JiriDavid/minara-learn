"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CourseEnrollButton({ courseId }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    // If not logged in, redirect to login
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/courses/${courseId}`);
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      // Check if user is already enrolled
      const checkRes = await fetch(
        `/api/enrollments/check?courseId=${courseId}`
      );
      const checkData = await checkRes.json();

      if (checkData.isEnrolled) {
        // If already enrolled, go to course learning page
        router.push(`/learn/${courseId}`);
        return;
      }

      // Enroll in course
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to enroll in course");
      }

      toast.success("Successfully enrolled in course!");
      router.push(`/learn/${courseId}`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error(error.message || "Failed to enroll in course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      className="w-full"
      variant="primary"
      size="lg"
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Enroll Now"}
    </Button>
  );
}
