import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "@/lib/auth-context";
import { PerformanceOverlay } from "@/lib/performance";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
  preload: true,
});

export const metadata = {
  title: "Minara Learn - Learning Management System",
  description:
    "Minara is a powerful learning management system for students, instructors, and administrators.",
  keywords: ["LMS", "education", "online learning", "e-learning", "courses"],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}
      >
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster position="top-right" richColors />
          <PerformanceOverlay />
        </AuthProvider>
      </body>
    </html>
  );
}
