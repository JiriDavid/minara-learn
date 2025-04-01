"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <LogOut className="h-12 w-12 text-slate-700 dark:text-slate-300" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign Out</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Are you sure you want to sign out of your account?
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-slate-600 dark:text-slate-400">
            You will need to sign in again to access your account.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleSignOut}
            className="w-full"
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? "Signing out..." : "Yes, Sign Out"}
          </Button>
          <Button
            onClick={handleCancel}
            className="w-full"
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
