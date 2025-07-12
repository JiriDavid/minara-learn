import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "@/lib/auth-context";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Minara Learn - Learning Management System",
  description:
    "Minara is a powerful learning management system for students, lecturers, and administrators.",
  keywords: ["LMS", "education", "online learning", "e-learning", "courses"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}
      >
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
