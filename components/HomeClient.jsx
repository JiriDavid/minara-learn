"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@/lib/auth-context";
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
import { Input } from "@/components/ui/input";

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
      {/* Subtle linear gradient blend of palette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#03045e,#0077b6,#00b4d8,#90e0ef,#caf0f8)] opacity-[0.03] dark:opacity-[0.05]" />

      {/* Radial highlight for visual depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,183,255,0.2),transparent_50%)] dark:opacity-20" />

      {/* Animated pattern overlay */}
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

// Gradient background using your colors
const GradientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Base smooth gradient from dark to light palette tones */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#03045e] via-[#0077b6] to-[#00b4d8]" />

    {/* Subtle linear gradient layer */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0077b6,#00b4d8,#90e0ef)] opacity-[0.05] dark:opacity-[0.07]" />

    {/* Radial effect to simulate ambient lighting */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(144,224,239,0.2),transparent_50%)] dark:opacity-20" />

    <AnimatedPattern />
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
const StatCard = ({ icon, value, label, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Map string icon names to actual Lucide icons
  const iconMap = {
    Users: Users,
    BookOpen: BookOpen,
    Star: Star,
    GraduationCap: GraduationCap,
    Globe: Globe,
    // Add more icons as needed
  };

  // Get the icon component from the map, or fallback to BookOpen
  const IconComponent =
    typeof icon === "string" ? iconMap[icon] || BookOpen : icon;

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
          <IconComponent className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-3xl font-bold text-text-light dark:text-text-dark">
          {value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
};

export default function HomeClient({ courses, stats }) {
  const { user, loading } = useAuth();
  const isSignedIn = !!user && !loading;
  const [searchQuery, setSearchQuery] = useState("");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
              className="text-4xl font-bold text-white sm:text-6xl"
            >
              Transform Your Future with{" "}
              <span className="text-[#03045e]">Online Learning</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-100"
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
                  className="group bg-secondary hover:bg-primary-6002 text-primary dark:bg-gray-900 "
                >
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {!isSignedIn && (
                <Link href="/register">
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
                className="h-12 w-full rounded-full border-primary-200 pl-6 pr-12 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-primary-800 dark:bg-gray-900 placeholder:text-primary"
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
              <CourseCard
                key={course.id}
                course={{
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  image:
                    course.thumbnail_url ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  category: course.category,
                  instructor: {
                    name: course.lecturer?.name || "Unknown Instructor",
                    image:
                      course.lecturer?.avatar_url ||
                      "https://randomuser.me/api/portraits/men/1.jpg",
                  },
                  rating: course.average_rating || 4.5,
                }}
                index={index}
              />
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
                <Link href="/register">
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
                    className="group bg-white text-primary-600 hover:bg-primary-50 dark:bg-gray-900"
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
