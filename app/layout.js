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
  title: "Minara Learn",
  description:
    "Minara, zimsec-oriented courses plaform for Zimbabwean students. Offering a wide range of subjects and resources to help you excel in your studies.",
  keywords: ["LMS", "education", "online learning", "e-learning", "courses", "zimsec", "Zimbabwe", "students", "study resources", "zimsec", "Minara", "Minara Learn", "Minara LMS", "Minara Education", "Minara Courses", "Minara Zimbabwe", "Minara Students", "Minara Learning", "Minara Platform", "Minara Study", "Minara Resources", "Minara Subjects", "Minara Exams", "Minara Revision", "Minara Tutorials", "Minara Lessons", "Minara Classes", "Minara Online", "Minara Digital Learning", "Minara E-learning", "Minara Educational Platform", "Minara Learning Management System", "Minara LMS Zimbabwe", "Minara Education Platform", "Minara Online Courses", "Minara Study Platform", "Minara Learning Resources", "Minara Educational Resources", "Minara Academic Platform", "Minara Academic Resources", "Minara Academic Courses", "Minara Academic Learning", "Minara Academic Subjects", "Minara Academic Students", "Minara Academic Exams", "Minara Academic Revision", "Minara Academic Tutorials", "Minara Academic Lessons", "Minara Academic Classes", "zimsec revision", "zimsec courses", "zimsec students", "zimsec learning", "zimsec subjects", "zimsec exams", "zimsec resources"],
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
