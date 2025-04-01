import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createRouteMatcher } from "@clerk/nextjs/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "E-Xtra LMS - Learning Management System",
  description:
    "E-Xtra LMS is a powerful learning management system for students, lecturers, and administrators.",
  keywords: ["LMS", "education", "online learning", "e-learning", "courses"],
};

export default function RootLayout({ children }) {
  const isPublicRoute = createRouteMatcher([
    "/",
    "/courses",
    // other routes
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}
      >
        <ClerkProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Toaster position="top-right" richColors />
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
