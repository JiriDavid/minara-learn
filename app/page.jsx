"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Brain,
  Zap,
  Sparkles,
  Globe,
  Clock,
  Star,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  ArrowUpRight,
  Rocket,
  Target,
  Lightbulb,
  Shield,
  Award,
  TrendingUp,
  BarChart3,
  BookMarked,
  BookOpenCheck,
  BookOpenText,
  BookOpenIcon,
  BookOpenCheckIcon,
  BookOpenTextIcon,
  BookOpenIcon as BookOpenIcon2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Floating elements component
const FloatingElements = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-10 top-20 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-20 top-40 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
      />
    </div>
  );
};

// Animated background pattern component
const AnimatedPattern = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5,#7c3aed,#2563eb)] opacity-[0.03] dark:opacity-[0.05]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)] dark:opacity-20" />
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-[length:50px_50px] opacity-10"
      />
    </div>
  );
};

// Update the GradientBackground component
const GradientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background-light to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffc300,#ff9b00,#ff6900)] opacity-[0.03] dark:opacity-[0.05]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,195,0,0.1),transparent_50%)] dark:opacity-20" />
    <AnimatedPattern />
    <FloatingElements />
  </div>
);

// Animated feature card component
const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative overflow-hidden rounded-xl border border-primary-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-primary-800 dark:bg-gray-900/80"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <motion.div
        animate={{
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-500/5 blur-2xl"
      />
      <div className="relative">
        <div className="mb-4 inline-flex rounded-lg bg-primary-100 p-3 dark:bg-primary-900/30">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text-light dark:text-text-dark">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Animated course card component
const CourseCard = ({ course, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative overflow-hidden rounded-xl border border-primary-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-primary-800 dark:bg-gray-900/80"
    >
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={course.image}
          alt={course.title}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="bg-primary-100/90 text-primary-900 backdrop-blur-sm">
            {course.category}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-text-light dark:text-text-dark">
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={course.instructor.image}
              alt={course.instructor.name}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.instructor.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-primary-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.rating}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Animated stats component
const StatCard = ({ icon: Icon, value, label, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden rounded-xl border border-primary-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-primary-800 dark:bg-gray-900/80"
    >
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-500/5 blur-2xl"
      />
      <div className="relative">
        <div className="mb-4 inline-flex rounded-lg bg-primary-100 p-3 dark:bg-primary-900/30">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-3xl font-bold text-text-light dark:text-text-dark">
          {value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const { isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "Complete JavaScript Course 2023",
      description:
        "Master JavaScript with the most comprehensive course available.",
      image: "https://placehold.co/600x400/ffc300/ffffff?text=JavaScript",
      category: "Programming",
      instructor: {
        name: "John Doe",
        image: "https://placehold.co/100x100/ffc300/ffffff?text=JD",
      },
      rating: 4.8,
    },
    {
      id: 2,
      title: "React - The Complete Guide",
      description:
        "Learn React.js from scratch with hands-on projects and real-world applications.",
      image: "https://placehold.co/600x400/ff9b00/ffffff?text=React",
      category: "Web Development",
      instructor: {
        name: "Jane Smith",
        image: "https://placehold.co/100x100/ff9b00/ffffff?text=JS",
      },
      rating: 4.9,
    },
    {
      id: 3,
      title: "Node.js API Masterclass",
      description: "Build scalable and secure APIs with Node.js and Express.",
      image: "https://placehold.co/600x400/ff6900/ffffff?text=Node.js",
      category: "Backend",
      instructor: {
        name: "Mike Johnson",
        image: "https://placehold.co/100x100/ff6900/ffffff?text=MJ",
      },
      rating: 4.7,
    },
  ];

  // Mock data for features
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Courses",
      description:
        "Access a wide range of high-quality courses taught by industry experts.",
    },
    {
      icon: Users,
      title: "Interactive Learning",
      description:
        "Engage with instructors and peers through live sessions and discussions.",
    },
    {
      icon: Brain,
      title: "Smart Learning Path",
      description:
        "Personalized learning paths based on your goals and progress.",
    },
    {
      icon: Zap,
      title: "Quick Progress",
      description:
        "Track your learning progress and earn certificates as you complete courses.",
    },
  ];

  // Mock data for stats
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "Active Students",
    },
    {
      icon: BookOpen,
      value: "500+",
      label: "Courses Available",
    },
    {
      icon: Star,
      value: "4.8/5",
      label: "Average Rating",
    },
    {
      icon: Globe,
      value: "150+",
      label: "Countries",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <GradientBackground />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-6xl"
            >
              Transform Your Future with{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Online Learning
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400"
            >
              Access world-class education from anywhere. Learn at your own pace
              and transform your career with our comprehensive online courses.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link href="/courses">
                <Button
                  size="lg"
                  className="group bg-primary-500 hover:bg-primary-600"
                >
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {!isSignedIn && (
                <Link href="/sign-up">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-200 text-primary-600 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/30"
                  >
                    Get Started
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-full border-primary-200 pl-6 pr-12 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-primary-800 dark:bg-gray-900"
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-primary-500 hover:bg-primary-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Experience the future of online learning with our cutting-edge
              platform.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="bg-primary-50 px-4 py-16 dark:bg-gray-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
              Popular Courses
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Start your learning journey with our most popular courses.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 text-center"
          >
            <Link href="/courses">
              <Button
                variant="outline"
                size="lg"
                className="group border-primary-200 text-primary-600 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/30"
              >
                View All Courses
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Start Learning?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-50">
              Join thousands of students who are already transforming their
              careers with our platform.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-10"
            >
              {!isSignedIn ? (
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group bg-white text-primary-600 hover:bg-primary-50"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group bg-white text-primary-600 hover:bg-primary-50"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
