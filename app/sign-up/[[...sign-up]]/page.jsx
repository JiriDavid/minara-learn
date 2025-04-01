"use client";

import { SignUp } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                dividerLine: "bg-slate-200 dark:bg-slate-700",
                dividerText: "text-slate-500 dark:text-slate-400",
                formFieldLabel: "text-slate-700 dark:text-slate-300",
                formFieldInput:
                  "rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900",
                footerActionLink:
                  "text-blue-600 hover:text-blue-700 dark:text-blue-400",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
