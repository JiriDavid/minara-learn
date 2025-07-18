"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Download, Share2, ArrowLeft } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CertificatePage({ params }) {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);
  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        if (!isLoaded || !userId) return;

        setIsLoading(true);
        // In a real app, fetch from API
        // const response = await fetch(`/api/certificates/${params.id}`);
        // if (!response.ok) throw new Error("Certificate not found");
        // const data = await response.json();

        // Mock data for demonstration
        const mockCertificate = {
          id: params.id,
          courseId: "course123",
          userId: userId,
          userName: "John Doe",
          courseName: "JavaScript Fundamentals",
          instructorName: "Jane Smith",
          issueDate: new Date().toISOString(),
          completionDate: new Date().toISOString(),
          logoUrl: "https://placehold.co/150/2563eb/FFFFFF/png?text=Minara",
          signature:
            "https://placehold.co/200x100/2563eb/FFFFFF/png?text=Signature",
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        setCertificate(mockCertificate);
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError(err.message || "Failed to load certificate");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [params.id, userId, isLoaded]);

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 277; // A4 width in landscape (297 - margins)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(
        `certificate-${certificate.courseName
          .replace(/\s+/g, "-")
          .toLowerCase()}.pdf`
      );
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to download certificate. Please try again.");
    }
  };

  const shareCertificate = async () => {
    if (!navigator.share) {
      alert("Web Share API is not supported in your browser");
      return;
    }

    try {
      await navigator.share({
        title: `Certificate of Completion - ${certificate.courseName}`,
        text: `Check out my certificate for completing ${certificate.courseName}!`,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Error sharing certificate:", err);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="mb-8">{error}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container max-w-6xl py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Certificate Not Found</h1>
        <p className="mb-8">
          The certificate you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Button onClick={() => router.push("/dashboard/student/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={downloadAsPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={shareCertificate}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Certificate Display */}
      <div className="flex justify-center">
        <div className="w-full overflow-hidden">
          <div
            ref={certificateRef}
            className="bg-white border-4 border-blue-600 rounded-lg w-full aspect-[4/3] p-12 relative"
          >
            {/* Certificate Content */}
            <div className="flex flex-col items-center justify-between h-full">
              {/* Header */}
              <div className="text-center">
                <div className="mb-4 relative w-24 h-24 mx-auto">
                  <Image
                    src={certificate.logoUrl}
                    alt="Company Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-3xl font-bold text-blue-600 mb-1">
                  Minara Learning
                </h1>
                <div className="w-80 h-1 bg-blue-600 mx-auto mb-6"></div>
                <h2 className="text-4xl font-serif font-bold text-slate-800 mb-3">
                  Certificate of Completion
                </h2>
                <p className="text-slate-600">This is to certify that</p>
              </div>

              {/* Main Content */}
              <div className="text-center flex-1 flex flex-col justify-center py-6">
                <h3 className="text-3xl font-serif font-bold text-slate-800 mb-6">
                  {certificate.userName}
                </h3>
                <p className="text-lg text-slate-600 mb-2">
                  has successfully completed the course
                </p>
                <h4 className="text-2xl font-bold text-blue-600 mb-6">
                  {certificate.courseName}
                </h4>
                <p className="text-slate-600 mb-1">
                  Issued on{" "}
                  {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Footer */}
              <div className="w-full">
                <div className="flex justify-between items-end">
                  <div className="text-center">
                    <div className="w-48 h-0.5 bg-slate-300 mb-1"></div>
                    <p className="text-sm text-slate-600">
                      Certificate ID: {certificate.id}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="relative h-16 w-40 mx-auto mb-2">
                      <Image
                        src={certificate.signature}
                        alt="Instructor Signature"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="w-48 h-0.5 bg-slate-800 mb-1"></div>
                    <p className="text-sm text-slate-600">
                      {certificate.instructorName}
                    </p>
                    <p className="text-xs text-slate-500">Instructor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Elements */}
            <div className="absolute top-0 left-0 w-48 h-48 border-t-8 border-l-8 border-blue-600 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-48 h-48 border-t-8 border-r-8 border-blue-600 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 border-b-8 border-l-8 border-blue-600 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 border-b-8 border-r-8 border-blue-600 rounded-br-lg"></div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          This certificate verifies your successful completion of the course.
          You can download it as a PDF or share it on social media.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(`/courses/${certificate.courseId}`)}
        >
          View Course Details
        </Button>
      </div>
    </div>
  );
}
