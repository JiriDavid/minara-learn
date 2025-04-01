"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    let errorMessage = "An error occurred during authentication";

    if (errorParam === "CredentialsSignin") {
      errorMessage = "Invalid email or password";
    } else if (errorParam === "OAuthSignin") {
      errorMessage = "Error signing in with OAuth provider";
    } else if (errorParam === "OAuthCallback") {
      errorMessage = "Error during OAuth callback";
    } else if (errorParam === "OAuthCreateAccount") {
      errorMessage = "Error creating account with OAuth provider";
    } else if (errorParam === "Callback") {
      errorMessage = "Error during authentication callback";
    } else if (errorParam === "AccessDenied") {
      errorMessage =
        "Access denied. You do not have permission to access this resource";
    } else if (errorParam) {
      errorMessage = `Authentication error: ${errorParam}`;
    }

    setError(errorMessage);
  }, [searchParams]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            There was a problem with your authentication
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="p-4 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
            <p className="text-center text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full" variant="default">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
