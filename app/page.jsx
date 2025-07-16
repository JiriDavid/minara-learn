"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@/lib/auth-context";
import Background from "@/components/Background"
import getCourses from "@/lib/GetCourses";
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
      {[
        {
          className: "left-10 top-20 h-32 w-32 bg-blue-500/20",
          animation: { y: [0, -30, 0], rotate: [0, 8, 0] },
          duration: 8,
        },
        {
          className: "right-20 top-32 h-36 w-36 bg-purple-600/20",
          animation: { y: [0, 25, 0], rotate: [0, -8, 0] },
          duration: 10,
        },
        {
          className:
            "left-1/2 bottom-20 h-48 w-48 bg-pink-500/20 -translate-x-1/2",
          animation: { scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] },
          duration: 14,
        },
        {
          className: "top-1/4 right-1/3 h-20 w-20 bg-yellow-400/10",
          animation: { x: [0, 30, 0], rotate: [0, 10, 0] },
          duration: 12,
        },
      ].map((shape, i) => (
        <motion.div
          key={i}
          animate={shape.animation}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full blur-3xl ${shape.className}`}
        />
      ))}
    </div>
  );
};

// Animated background pattern component
const AnimatedPattern = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Soft color gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6a00f4,#0077b6,#00b4d8,#90e0ef,#caf0f8)] opacity-[0.035] dark:opacity-[0.06]" />

      {/* Radial spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(160,100,255,0.2),transparent_60%)] dark:opacity-20" />

      {/* Subtle animated grid pattern */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-[length:50px_50px] opacity-10"
      />
    </div>
  );
};

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
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03, y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-md backdrop-blur-md transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70"
    >
      {/* Glowing hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Floating glow effect */}
      <motion.div
        animate={{ rotate: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-purple-400/10 blur-2xl"
      />

      <div className="relative z-10">
        <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
          <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
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
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-md backdrop-blur-md transition-all hover:shadow-xl dark:border-slate-800 dark:bg-gray-900/80"
    >
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={course.image}
          alt={course.title}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-purple-100/90 text-purple-900 dark:bg-purple-900/40 dark:text-purple-200 backdrop-blur-sm">
            {course.category}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.itle}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.06 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-gray-900/80"
    >
      {/* Rotating soft glow */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-5 -right-5 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl"
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
          <Icon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
};


export default function Home() {
  const { user, loading } = useAuth();
  const isSignedIn = !!user && !loading;
  const [searchQuery, setSearchQuery] = useState("");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadCourses() {
      const data = await getCourses();
      setCourses(data.slice(0, 3));
    }
    loadCourses();
  }, []);

  // // Updated data for ZIMSEC courses
  // const courses = [
  //   {
  //     id: 1,
  //     title: "Mathematics for ZIMSEC O-Level",
  //     description: "Master key mathematical concepts for ZIMSEC success.",
  //     image: "https://placehold.co/600x400/ffc300/ffffff?text=Maths",
  //     category: "O-Level",
  //     tutor: {
  //       name: "Tendai Moyo",
  //       image: "https://placehold.co/100x100/ffc300/ffffff?text=TM",
  //     },
  //     rating: 4.8,
  //   },
  //   {
  //     id: 2,
  //     title: "English Language for ZIMSEC A-Level",
  //     description: "Excel in comprehension and composition for A-Level.",
  //     image: "https://placehold.co/600x400/ff9b00/ffffff?text=English",
  //     category: "A-Level",
  //     tutor: {
  //       name: "Rumbidzai Chari",
  //       image: "https://placehold.co/100x100/ff9b00/ffffff?text=RC",
  //     },
  //     rating: 4.9,
  //   },
  //   {
  //     id: 3,
  //     title: "Combined Science for ZIMSEC",
  //     description: "Comprehensive science preparation for O-Level exams.",
  //     image: "https://placehold.co/600x400/ff6900/ffffff?text=Science",
  //     category: "O-Level",
  //     tutor: {
  //       name: "Tinashe Nyika",
  //       image: "https://placehold.co/100x100/ff6900/ffffff?text=TN",
  //     },
  //     rating: 4.7,
  //   },
  // ];

  // Updated features for ZIMSEC focus
  const features = [
    {
      icon: BookOpen,
      title: "ZIMSEC-Aligned Curriculum",
      description: "Courses tailored to the ZIMSEC syllabus for exam success.",
    },
    {
      icon: Users,
      title: "Expert Tutors",
      description: "Learn from experienced Zimbabwean educators.",
    },
    {
      icon: Shield,
      title: "Safe Learning Environment",
      description: "Secure online platform free from physical risks.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Study at your own pace from anywhere in Zimbabwe.",
    },
  ];

  // Updated stats
  const stats = [
    {
      icon: BookOpen,
      value: "15+",
      label: "ZIMSEC Subjects",
    },
    {
      icon: Users,
      value: "50+",
      label: "Expert Tutors",
    },
    {
      icon: Star,
      value: "95%",
      label: "Student Success",
    },
    {
      icon: GraduationCap,
      value: "1000+",
      label: "Active Students",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <Background />
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
              Master ZIMSEC Exams with Expert-Led{" "}
              <span className="text-[#613bdd]">Online Lessons</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-100"
            >
              Acess top-quality ZIMSEC preparation from anywhere in Zimbabwe.
              Safe, flexible, and tailored to your needs.
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
                  Explore Subjects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {!isSignedIn && (
                <Link href="/auth/signup">
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
                placeholder="Search ZIMSEC subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-full border-primary-200 pl-6 pr-12 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-primary-800 dark:bg-gray-900 placeholder:text-gray-200 text-white"
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
            <h2 className="text-3xl font-bold tracking-tight text-white dark:text-text-dark sm:text-4xl">
              Why Choose Our <span className="text-[#613bdd]">Platform?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300 dark:text-gray-400">
              Quality Education for ZIMSEC success, accessible and safe.
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
            <h2 className="text-3xl font-bold tracking-tight text-white dark:text-text-dark sm:text-4xl">
              Popular <span className="text-[#613bdd]">Courses</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300 dark:text-gray-400">
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
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">
              Join a growing community of learners who are unlocking their
              potential and shaping the future with Minara Learn.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-10"
            >
              {!isSignedIn ? (
                <Link href="/auth/signup">
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
