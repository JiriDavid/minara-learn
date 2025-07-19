"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Award,
  ArrowRight,
  User,
  UserCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthLanding() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden w-full">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center py-6 px-4 max-w-8xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8 text-center animate-fade-in">
          <Link href="/" className="inline-flex items-center mb-6 group transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Minara Learn
              </span>
            </div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
            Welcome to Your
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Join <span className="font-semibold text-blue-600 dark:text-blue-400">thousands of students</span> and <span className="font-semibold text-purple-600 dark:text-purple-400">expert instructors</span> in our comprehensive learning management platform
          </p>
        </div>

        {/* Enhanced Main Auth Tabs */}
        <div className="w-full max-w-7xl mx-auto">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 mb-8 h-12 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg">
              <TabsTrigger 
                value="signin" 
                className="h-10 text-base font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="h-10 text-base font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Get Started
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Sign In Tab */}
            <TabsContent value="signin" className="mt-0 animate-fade-in">
              <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4 pt-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome Back</CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-300">
                      Sign in to continue your learning journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                    <Link href="/auth/signin">
                      <Button className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                        Sign In to Your Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <div className="text-center">
                      <Link 
                        href="/auth/forgot-password" 
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300 hover:underline text-sm"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Enhanced Sign Up Tab */}
            <TabsContent value="signup" className="mt-0 animate-fade-in">
              <div className="max-w-8xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learning Path</span>
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    Select how you'd like to use Minara Learn and start your journey today
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                  {/* Enhanced Student Registration Card */}
                  <Card className="group relative border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-500 hover:shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm cursor-pointer transform hover:scale-[1.02] overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardHeader className="relative text-center pb-4 pt-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        I'm a Student
                      </CardTitle>
                      <CardDescription className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        Learn new skills, take courses, and earn certificates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4 px-6 pb-6">
                      <div className="space-y-3">
                        <div className="flex items-center text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium">Access to all courses and learning materials</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <Award className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium">Earn certificates upon course completion</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <Users className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium">Join study groups and discussions</span>
                        </div>
                      </div>
                      <Link href="/auth/signup/student" className="block mt-6">
                        <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                          Sign Up as Student
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Enhanced Instructor Registration Card */}
                  <Card className="group relative border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-500 hover:shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm cursor-pointer transform hover:scale-[1.02] overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardHeader className="relative text-center pb-4 pt-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        I'm an Instructor
                      </CardTitle>
                      <CardDescription className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        Share your knowledge and create courses for students
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4 px-6 pb-6">
                      <div className="space-y-3">
                        <div className="flex items-center text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <BookOpen className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-sm font-medium">Create and manage your own courses</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <Users className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-sm font-medium">Track student progress and engagement</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <UserCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-sm font-medium">Build your teaching portfolio</span>
                        </div>
                      </div>
                      <Link href="/auth/signup/instructor" className="block mt-6">
                        <Button 
                          variant="outline" 
                          className="w-full h-12 text-base font-semibold border-2 border-purple-200 dark:border-purple-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group-hover:border-purple-400"
                        >
                          Apply as Instructor
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-8">
                  <p className="text-base text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <button 
                      onClick={() => {
                        const signinTab = document.querySelector('[value="signin"]');
                        if (signinTab) signinTab.click();
                      }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-10 text-center">
          <div className="max-w-3xl mx-auto p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
