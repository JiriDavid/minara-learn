"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, User, BookOpen } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function StudentSignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rateLimitUntil, setRateLimitUntil] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  // Rate limit countdown timer
  const [countdown, setCountdown] = useState(0);
  
  useEffect(() => {
    let interval;
    if (rateLimitUntil) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((rateLimitUntil - Date.now()) / 1000));
        setCountdown(remaining);
        
        if (remaining === 0) {
          setRateLimitUntil(null);
          clearInterval(interval);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rateLimitUntil]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    // Check if we're still in rate limit period
    if (countdown > 0) {
      toast.error(`Please wait ${countdown} more seconds before trying again`);
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!data.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,  // Changed from display_name to name
            role: "student",
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        
        // Handle rate limiting specifically
        if (authError.message && authError.message.includes('48 seconds')) {
          setRateLimitUntil(Date.now() + 48000); // 48 seconds from now
          toast.error("Too many signup attempts. Please wait 48 seconds before trying again.", {
            duration: 5000,
          });
        } else if (authError.message && authError.message.includes('security purposes')) {
          setRateLimitUntil(Date.now() + 60000); // 60 seconds from now
          toast.error("Rate limit reached. Please wait a minute before trying again.", {
            duration: 5000,
          });
        } else if (authError.message && authError.message.includes('User already registered')) {
          toast.error("An account with this email already exists. Please try signing in instead.", {
            duration: 5000,
          });
        } else {
          toast.error(authError.message || "Failed to create account");
        }
        return;
      }

      if (authData.user) {
        console.log('User created successfully:', authData.user.id);
        
        // Always try to create/update the profile to ensure it exists
        const profileData = {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: "student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log('Creating/updating profile with data:', profileData);

        // Try multiple approaches to ensure profile creation works
        let profileCreated = false;
        let profileError = null;

        // Method 1: Try upsert first
        try {
          const { data: profileResult, error: upsertError } = await supabase
            .from("profiles")
            .upsert([profileData], { 
              onConflict: 'id',
              ignoreDuplicates: false 
            })
            .select();

          if (!upsertError && profileResult) {
            console.log('Profile upserted successfully:', profileResult);
            profileCreated = true;
          } else {
            throw upsertError || new Error('Upsert returned no data');
          }
        } catch (upsertErr) {
          console.log('Upsert failed, trying insert:', upsertErr);
          
          // Method 2: Try simple insert
          try {
            const { data: insertResult, error: insertError } = await supabase
              .from("profiles")
              .insert([profileData])
              .select();

            if (!insertError && insertResult) {
              console.log('Profile inserted successfully:', insertResult);
              profileCreated = true;
            } else {
              throw insertError || new Error('Insert returned no data');
            }
          } catch (insertErr) {
            console.log('Insert failed, checking if profile exists:', insertErr);
            
            // Method 3: Check if profile already exists
            const { data: existingProfile, error: checkError } = await supabase
              .from("profiles")
              .select("id, email, name, role")
              .eq("id", authData.user.id)
              .single();

            if (existingProfile && !checkError) {
              console.log('Profile already exists:', existingProfile);
              profileCreated = true;
            } else {
              profileError = insertErr || checkError;
              console.error('All profile creation methods failed:', profileError);
              console.error('Profile creation failed with details:', {
                upsertError: upsertErr?.message || 'No upsert error',
                insertError: insertErr?.message || 'No insert error', 
                checkError: checkError?.message || 'No check error',
                userId: authData.user.id,
                email: data.email,
                fullName: data.name
              });
            }
          }
        }

        if (!profileCreated) {
          console.error("Profile creation error:", profileError);
          console.error("Error details:", {
            message: profileError?.message || 'Unknown error',
            details: profileError?.details || 'No details available',
            hint: profileError?.hint || 'No hint available',
            code: profileError?.code || 'No code available'
          });
          
          // More specific error messages based on error type
          if (profileError?.code === '42501') {
            toast.error("Database permission error. Please run the emergency database fix first.", {
              duration: 7000,
            });
          } else if (profileError?.message?.includes('RLS')) {
            toast.error("Row Level Security blocking profile creation. Please run the database fix.", {
              duration: 7000,
            });
          } else {
            toast.error(`Failed to create user profile: ${profileError?.message || 'Unknown error'}. Please contact support.`, {
              duration: 7000,
            });
          }
          return;
        }

        console.log('Profile created/verified successfully');
        toast.success("Account created successfully! Please check your email to verify your account.");
        router.push("/auth/signin?message=Please check your email to verify your account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container flex min-h-screen flex-col items-center justify-center py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/auth/signup" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to options
          </Link>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create Your Student Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Start your learning journey with Minara Learn
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Student Registration</CardTitle>
            <CardDescription>
              Join thousands of students learning new skills
            </CardDescription>
            {countdown > 0 && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⏱️ Rate limit active: {countdown}s remaining
              </div>
            )}
          </CardHeader>
          <CardContent>
            {/* Database Fix Notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 mt-0.5">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Having signup issues?
                  </h4>
                  <p className="text-sm text-blue-700">
                    If you encounter profile creation errors, you may need to run the{" "}
                    <Link 
                      href="/admin/emergency-fix" 
                      className="underline font-medium hover:text-blue-800"
                      target="_blank"
                    >
                      database emergency fix
                    </Link>{" "}
                    first to resolve authentication issues.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Password must contain uppercase, lowercase, and number",
                      },
                    })}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={watch("agreeToTerms")}
                  onCheckedChange={(checked) => setValue("agreeToTerms", checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading || countdown > 0}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Account...
                  </>
                ) : countdown > 0 ? (
                  `Please wait ${countdown}s before trying again`
                ) : (
                  "Create Student Account"
                )}
              </Button>
              
              {/* Rate limit info */}
              {countdown > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⏱️ Rate limit active. Please wait {countdown} seconds before submitting again.
                    This is a security measure to prevent spam.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRateLimitUntil(null);
                      setCountdown(0);
                    }}
                    className="mt-2 text-xs text-yellow-600 hover:text-yellow-800 underline"
                  >
                    Clear rate limit (if you waited already)
                  </button>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}