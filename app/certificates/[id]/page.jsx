"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Download, Share2, Trophy } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";

export default function CertificatePage({ params }) {
  const { id } = params;
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const certificateRef = useRef(null);

  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        // Check authentication
        if (isLoaded && !userId) {
          router.push("/sign-in");
          return;
        }

        if (!isLoaded) return;

        // In real app, fetch certificate data from API
        // For now using mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock certificate data
        const mockCertificate = {
          id,
          courseId: "course-123",
          courseTitle: "Advanced Web Development with React and Next.js",
          userName: "John Doe",
          issueDate: "2023-10-15",
          completionDate: "2023-10-10",
          instructorName: "Dr. Jane Smith",
          instructorTitle: "Senior Web Development Instructor",
          certificateNumber: `CERT-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`,
          courseHours: 42,
        };

        setCertificate(mockCertificate);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching certificate:", error);
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [id, userId, isLoaded, router]);

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;

    try {
      setIsDownloading(true);

      const certificateElement = certificateRef.current;
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificate-${certificate.certificateNumber}.pdf`);

      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      setIsDownloading(false);
    }
  };

  const shareCertificate = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Course Certificate",
          text: `Check out my certificate for completing ${certificate.courseTitle}!`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Certificate link copied to clipboard!"))
        .catch((err) => console.error("Error copying link:", err));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
          <p className="mb-6">
            The certificate you are looking for does not exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => router.push("/dashboard/student")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Certificate</h1>
        <div className="flex gap-4">
          <Button
            onClick={downloadAsPDF}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>
          <Button
            variant="outline"
            onClick={shareCertificate}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg flex justify-center">
        <div
          ref={certificateRef}
          className="certificate-container relative bg-gradient-to-r from-blue-50 to-indigo-50 p-16 border-8 border-double border-indigo-200 w-full max-w-5xl aspect-[1.5/1]"
        >
          {/* Certificate Header */}
          <div className="absolute top-4 right-4">
            <div className="text-right text-slate-500 text-sm">
              Certificate #: {certificate.certificateNumber}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <Trophy className="w-full h-full text-yellow-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">
              Certificate of Completion
            </h2>
            <div className="text-slate-600">This is to certify that</div>
          </div>

          {/* Certificate Body */}
          <div className="text-center mb-10">
            <h3 className="text-4xl font-serif font-bold text-indigo-700 mb-4 border-b-2 border-indigo-200 pb-2 inline-block">
              {certificate.userName}
            </h3>
            <p className="text-slate-600 text-lg mb-6">
              has successfully completed the course
            </p>
            <h4 className="text-2xl font-serif font-bold text-slate-800 mb-4">
              {certificate.courseTitle}
            </h4>
            <p className="text-slate-600">
              with a total of {certificate.courseHours} learning hours
            </p>
          </div>

          {/* Certificate Footer */}
          <div className="flex justify-between items-center mt-12">
            <div className="text-center">
              <div className="w-48 border-t border-slate-400 mb-2"></div>
              <p className="font-serif font-bold">
                {certificate.instructorName}
              </p>
              <p className="text-sm text-slate-600">
                {certificate.instructorTitle}
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 border-t border-slate-400 mb-2"></div>
              <p className="font-serif font-bold">Date Issued</p>
              <p className="text-sm text-slate-600">
                {formatDate(certificate.issueDate)}
              </p>
            </div>
          </div>

          {/* Certificate Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <div className="relative w-80 h-80">
              <Trophy className="w-full h-full text-indigo-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Certificate Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-500">Course</p>
            <p className="font-medium">{certificate.courseTitle}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Completion Date</p>
            <p className="font-medium">
              {formatDate(certificate.completionDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Certificate ID</p>
            <p className="font-medium">{certificate.certificateNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Issued On</p>
            <p className="font-medium">{formatDate(certificate.issueDate)}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-slate-500">
            This certificate verifies that the above-named person has
            successfully completed the described course and demonstrated an
            understanding of the material.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            To verify this certificate, please contact our support team with the
            certificate number.
          </p>
        </div>
      </div>
    </div>
  );
}
