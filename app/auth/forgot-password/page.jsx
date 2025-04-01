"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // In a real application, this would send a request to your API
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });

      // For demonstration purposes, we're just setting a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      toast.success(
        "If an account exists with that email, a password reset link has been sent"
      );
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Forgot your password?
          </CardTitle>
          <CardDescription>
            {isSubmitted
              ? "Check your email for reset instructions"
              : "Enter your email address and we will send you a link to reset your password"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Mail className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                We've sent a password reset link to your email address. Please
                check your inbox and follow the instructions to reset your
                password.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                If you don't see the email, check your spam folder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/auth/signin"
            className="flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
