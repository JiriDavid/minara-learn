'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import {
  Play,
  Book,
  Clock,
  BarChart3,
  Star,
  Users,
  CheckCircle,
  Calendar,
  BookOpen,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { formatPrice, convertMinutesToHours } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CoursePageClient({ course }) {
  const {
    title,
    description,
    thumbnail,
    price,
    discount = 0,
    lecturer,
    totalDuration,
    totalLessons,
    level,
    language,
    category,
    tags,
    ratings,
    enrollmentCount,
    requirements,
    objectives,
    sections,
    publishedAt,
  } = course;

  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div className="container py-8 px-4">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Badge variant="outline" className="mb-4 ">
              {category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
            <p className="text-gray-600 mb-6">
              {description.substring(0, 300)}...
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-bold text-gray-600">{ratings?.average || "New"}</span>
                <span className="text-muted-foreground ml-1">
                  ({ratings?.count || 0} ratings)
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-1" />
                <span className="text-gray-600">{enrollmentCount || 0} students</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-500 mr-1" />
                <span className="text-gray-600">
                  Last updated {new Date(publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <Image
                src={lecturer?.avatar_url || "/profile-placeholder.png"}
                alt={lecturer?.name || "Instructor"}
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
              <div>
                <p className="font-semibold">{lecturer?.name}</p>
                <p className="text-sm text-muted-foreground">Instructor</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={thumbnail ? `/${thumbnail}` : "/images/zimsec.png"}
                alt={title}
                fill
                className="object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded">
                  {discount}% OFF
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  {discount > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-blue-600">
                        {formatPrice(discountedPrice)}
                      </span>
                      <span className="text-lg line-through text-slate-500">
                        {formatPrice(price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">
                      {price === 0 ? "Free" : formatPrice(price)}
                    </span>
                  )}
                </div>
              </div>

              <Button size="lg" className="w-full mb-4">
                Enroll Now
              </Button>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-slate-500" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">
                    {convertMinutesToHours(totalDuration)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-slate-500" />
                    <span>Lessons</span>
                  </div>
                  <span className="font-medium">{totalLessons} lessons</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-slate-500" />
                    <span>Level</span>
                  </div>
                  <span className="font-medium">{level}</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-slate-500" />
                    <span>Language</span>
                  </div>
                  <span className="font-medium">{language}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* What You'll Learn */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectives?.map((objective, index) => (
                  <div key={index} className="flex">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Course Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            <Card>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <span>
                    {sections?.length || 0} sections • {totalLessons || 0}{" "}
                    lessons
                  </span>
                  <Button variant="ghost" size="sm">
                    Expand All
                  </Button>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {sections?.map((section, index) => (
                  <AccordionItem key={index} value={`section-${index}`}>
                    <AccordionTrigger className="px-4 py-2 hover:no-underline">
                      <div className="flex justify-between items-center w-full text-left">
                        <span className="font-medium">{section.title}</span>
                        <span className="text-muted-foreground text-sm">
                          {section.lessons.length} lessons
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="divide-y">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <li
                            key={lessonIndex}
                            className="px-4 py-2 flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              {lesson.type === "video" ? (
                                <svg
                                  className="h-4 w-4 mr-2 text-blue-500"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9 10L15 14L9 18V10Z"
                                    fill="currentColor"
                                  />
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>
                              ) : lesson.type === "quiz" ? (
                                <svg
                                  className="h-4 w-4 mr-2 text-amber-500"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8 12H16M8 16H16M12 4V8M5 8H19M5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="h-4 w-4 mr-2 text-green-500"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 4V4C15.866 4 19 7.13401 19 11V16.6569C19 18.1566 17.6569 19.5 16.1572 19.5H12M12 4V4C8.13401 4 5 7.13401 5 11V16.6569C5 18.1566 6.34315 19.5 7.84285 19.5H12M12 4V19.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              )}
                              <span>{lesson.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration} min
                            </span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <Card className="p-6">
              <ul className="list-disc pl-5 space-y-2">
                {requirements?.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Instructor */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Instructor</h2>
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={lecturer?.avatar_url || "/placeholder-user.jpg"}
                  alt={lecturer?.name}
                  width={80}
                  height={80}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold">{lecturer?.name}</h3>
                  <p className="text-muted-foreground">Instructor</p>
                </div>
              </div>
              <p>{lecturer?.bio || "No bio available for this instructor."}</p>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Tags */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Similar Courses - This would be populated by a separate query */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Similar Courses</h2>
            <p className="text-muted-foreground">
              Check back later for course recommendations based on your
              interests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
