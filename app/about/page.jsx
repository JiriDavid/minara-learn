
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Background from "@/components/Background"
import {
  GraduationCap,
  BookOpen,
  Users,
  Sparkles,
  Building,
  Award,
  Check,
  BarChart,
} from "lucide-react";

export const metadata = {
  title: "About Us | Minara LMS",
  description:
    "Learn more about Mirana Learn and our mission to provide quality education to everyone.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Background />
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row gap-12 items-center mb-20">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Reimagining Education for Every{" "}
            <span className="text-blue-600">Student</span>
          </h1>
          <p className="text-lg text-slate-300 dark:text-slate-200 mb-6">
            Minara Learn is a learner-focused platform created to respond to
            Zimbabwe’s education inequalities. Our goal is to offer a safe,
            accessible, and affordable alternative to nighttime extra lessons
            that often expose students to risk and deepen financial inequality.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/courses">
              <Button
                size="lg"
                className="bg-white dark:bg-black text-blue-950 dark:text-gray-200"
              >
                Explore Subjects
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Students learning with E-X-TRA LMS"
              fill
              className="object-cover rounded-xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent rounded-xl" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 shadow-lg rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Reached Students So far
                </div>
                <div className="text-xl font-bold">15+</div>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 shadow-lg rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Available Subjects
                </div>
                <div className="text-xl font-bold">10+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Our Mission & Vision
          </h2>
          <p className="text-lg text-slate-300 dark:text-slate-400 max-w-3xl mx-auto">
            We exist to eliminate educational barriers caused by inequality,
            abuse, and inaccessibility — starting in Zimbabwe and reaching
            beyond.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="h-2 bg-blue-600" />
            <CardContent className="p-8">
              <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 p-3 w-fit rounded-lg">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                To stop the exploitation of students through unsafe and unfair
                extra lessons, and provide safe, affordable, and quality
                education through technology. We aim to empower learners
                regardless of location, income, or school system.
              </p>
              <ul className="space-y-3">
                {[
                  "Replace exploitative extra lessons with safe learning",
                  "Make quality education affordable and fair",
                  "Empower learners through digital access",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="h-2 bg-purple-600" />
            <CardContent className="p-8">
              <div className="mb-4 bg-purple-100 dark:bg-purple-900/30 p-3 w-fit rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                To build a platform that redefines how African learners access
                quality education, ensuring no student is left behind because of
                where they live or what they earn.
              </p>
              <ul className="space-y-3">
                {[
                  "Expand access beyond Zimbabwe into Africa",
                  "Bridge the gap between income and education",
                  "Promote dignity and safety in learning",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Minara Learn Journey"
              fill
              className="object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-2xl font-bold mb-2">
                From Problem to Purpose
              </h3>
              <p>
                Minara Learn started as a response to a painful truth — students
                in Zimbabwe were being forced into unsafe, expensive night
                lessons. We’re stepping up with a better way.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Our Story
            </h2>
            <div className="space-y-6 text-slate-200 dark:text-slate-400">
              <p>
                Minara Learn was founded in 2025 by David Promise Jiri with a
                burden to stop exploitative extra lessons that often took place
                late at night and left many students vulnerable.
              </p>
              <p>
                These night sessions not only exposed students to physical
                risks, but also deepened inequality— as only wealthier families
                could afford them. Many teachers began holding back during
                regular school hours to force learners into paying more.
              </p>
              <p>
                Minara Learn was born to change this — to offer students safe,
                affordable, and flexible access to quality learning anytime,
                anywhere. Though we’re just beginning, we believe this idea can
                transform education across Zimbabwe, Africa, and beyond.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">2025</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Year the Vision Was Born
                </div>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">3</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Local Learners Reached So Far
                </div>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">∞</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Potential to Impact the World
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Our Leadership Journey
          </h2>
          <p className="text-lg text-slate-300 dark:text-slate-200 max-w-3xl mx-auto">
            Every movement starts with one step. Minara Learn is currently led
            by its founder, David Promise Jiri, but the vision is to build a
            passionate team of educators, technologists, and community builders
            committed to transforming education across Africa.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-0 shadow-md group">
            <div className="relative h-60 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <div className="text-center px-6">
                <h3 className="text-xl font-bold mb-2">David Promise Jiri</h3>
                <p className="text-sm mb-1">Founder & Visionary</p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-200">
                David is a Computer Science student and innovator with a burden
                to make quality education safe and accessible for every learner
                — regardless of their background, income, or location. He
                currently leads Minara Learn solo while laying a foundation for
                a future team that shares this vision.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md group">
            <div className="relative h-60 overflow-hidden flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-center px-6">
              <p className="italic">
                "We’re not just building a platform — we’re building a team, a
                mission, and a movement. If you’re passionate about reshaping
                education in Africa, you’ll belong here someday."
              </p>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-200">
                As we grow, Minara Learn will welcome talented individuals in
                curriculum design, development, marketing, and operations — all
                united by a shared belief that education should be a right, not
                a luxury.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values & Culture */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Values & Culture
          </h2>
          <p className="text-lg text-slate-300 dark:text-slate-400 max-w-3xl mx-auto">
            The principles that guide our journey and shape who we are.
          </p>
        </div>

        <Tabs defaultValue="values" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-slate-800 p-1 rounded-full shadow-md">
              <TabsTrigger
                value="values"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-full transition-all"
              >
                Our Values
              </TabsTrigger>
              <TabsTrigger
                value="culture"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-full transition-all"
              >
                Our Culture
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-full transition-all"
              >
                Working Here
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Our Values */}
          <TabsContent value="values" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: "Innovation",
                  description:
                    "We continuously explore new ways to improve learning experiences and outcomes.",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Inclusivity",
                  description:
                    "We design our platform and content to be accessible and relevant to diverse learners.",
                },
                {
                  icon: <Award className="h-6 w-6" />,
                  title: "Excellence",
                  description:
                    "We maintain high standards in everything we do, from course content to customer support.",
                },
                {
                  icon: <Building className="h-6 w-6" />,
                  title: "Integrity",
                  description:
                    "We operate with honesty, transparency, and strong ethical principles.",
                },
                {
                  icon: <BarChart className="h-6 w-6" />,
                  title: "Impact",
                  description:
                    "We measure our success by the positive difference we make in learners' lives.",
                },
                {
                  icon: <BookOpen className="h-6 w-6" />,
                  title: "Lifelong Learning",
                  description:
                    "We believe that learning is a lifelong journey, and we embody that every day.",
                },
              ].map((value, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl bg-slate-100/80 dark:bg-slate-800/60"
                >
                  <CardContent className="p-6">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 w-fit rounded-lg mb-4 text-purple-600">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Our Culture */}
          <TabsContent value="culture" className="mt-6">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="relative h-[400px] overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Team Culture"
                  fill
                  className="object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  A Culture Rooted in Purpose and Vision
                </h3>
                <p className="text-slate-300 dark:text-slate-400 mb-6">
                  At Minara Learn, we are at the beginning of a bold journey—one
                  that's driven by a deep desire to make learning more
                  accessible, practical, and human-centered. While we're small
                  now, our culture is fueled by curiosity, grit, and a
                  commitment to lifelong growth.
                </p>
                <div className="space-y-4">
                  {[
                    "Purpose-led work that aims to solve real-world challenges in education",
                    "An open mindset that embraces feedback, learning, and iteration",
                    "A solo journey today—an inclusive, passionate team tomorrow",
                    "Transparency and honesty in everything we build and share",
                    "A culture that values vision over perfection, and progress over pressure",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-slate-300 dark:text-slate-400">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Benefits / Working Here */}
          {/* Benefits / Working Here */}
          <TabsContent value="benefits" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Be part of something meaningful from the very start",
                "Freedom to shape ideas and experiment without fear of failure",
                "A chance to grow with the organization as it evolves",
                "Honest conversations and deep respect for every voice",
                "Flexible involvement for early contributors and collaborators",
                "Opportunities for future roles and co-creation",
              ].map((benefit, i) => (
                <Card
                  key={i}
                  className="border-0 shadow-md hover:shadow-lg bg-white/70 dark:bg-slate-800/50 transition"
                >
                  <CardContent className="p-6 flex items-start gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full mt-1">
                      <Check className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {benefit}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/careers">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Explore How You Can Join Early
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Call to Action */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start your learning journey?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl">
              Join thousands of learners worldwide who are advancing their
              skills and careers with Mirana Learn.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" variant="secondary">
                  Explore Courses
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/20"
                >
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative w-[200px] h-[200px]">
              <Image
                src="/images/zimsec.png"
                alt="Zimsec Image"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
