import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/database";
import Course from "@/models/Course";
import User from "@/models/User";

// Sample course data
const COURSE_CATEGORIES = [
  "Web Development",
  "Data Science",
  "Mobile Development",
  "DevOps",
  "Design",
  "Marketing",
  "Business",
  "Photography",
  "Music",
  "Health & Fitness",
];

const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

// Generate course title
const generateCourseTitle = (category) => {
  const prefixes = [
    "Complete",
    "Comprehensive",
    "Ultimate",
    "Professional",
    "Practical",
    "Modern",
    "Essential",
    "Advanced",
    "Beginner's",
    "Mastering",
  ];

  const suffixes = [
    "Guide",
    "Bootcamp",
    "Course",
    "Masterclass",
    "Workshop",
    "Certification",
    "Training",
    "Fundamentals",
    "Tutorial",
    "Crash Course",
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${prefix} ${category} ${suffix}`;
};

// Generate course description
const generateCourseDescription = (title) => {
  return `This ${title.toLowerCase()} covers everything you need to know to become proficient in this subject. 
  You'll learn through hands-on projects, quizzes, and comprehensive lessons designed to build your skills 
  from the ground up. Whether you're a complete beginner or looking to advance your existing knowledge, 
  this course provides the perfect learning path for your journey.`;
};

// Generate lesson title for a section
const generateLessonTitle = (sectionIndex, lessonIndex, category) => {
  const introLessons = [
    "Introduction to the Course",
    "What You'll Learn",
    "Setting Up Your Environment",
    "Course Overview",
    "Getting Started",
  ];

  const middleLessons = [
    `Understanding ${category} Concepts`,
    `Working with ${category} Tools`,
    `${category} Best Practices`,
    `Solving Common ${category} Problems`,
    `Building Your First ${category} Project`,
    `Advanced ${category} Techniques`,
    `${category} Case Studies`,
    `Optimizing Your ${category} Workflow`,
  ];

  const concludingLessons = [
    "Course Summary",
    "Next Steps",
    "Final Project Overview",
    "Resources for Further Learning",
    "Career Opportunities in This Field",
  ];

  if (sectionIndex === 0) {
    return introLessons[lessonIndex % introLessons.length];
  } else if (sectionIndex === 4) {
    return concludingLessons[lessonIndex % concludingLessons.length];
  } else {
    return middleLessons[Math.floor(Math.random() * middleLessons.length)];
  }
};

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Clear existing courses
    await Course.deleteMany({});

    // Create sample courses
    const courses = [
      {
        title: "Complete JavaScript Course 2023",
        slug: "complete-javascript-course-2023",
        description:
          "Master JavaScript with the most comprehensive course available.",
        image: "/images/course-js.jpg",
        category: "Programming",
        instructor: {
          name: "John Doe",
          image: "/images/instructor-1.jpg",
        },
        price: 49.99,
        rating: 4.8,
        enrollmentCount: 0,
        lessons: [],
      },
      {
        title: "React - The Complete Guide",
        slug: "react-complete-guide",
        description:
          "Learn React.js from scratch with hands-on projects and real-world applications.",
        image: "/images/course-react.jpg",
        category: "Web Development",
        instructor: {
          name: "Jane Smith",
          image: "/images/instructor-2.jpg",
        },
        price: 59.99,
        rating: 4.9,
        enrollmentCount: 0,
        lessons: [],
      },
      {
        title: "Node.js API Masterclass",
        slug: "nodejs-api-masterclass",
        description: "Build scalable and secure APIs with Node.js and Express.",
        image: "/images/course-node.jpg",
        category: "Backend",
        instructor: {
          name: "Mike Johnson",
          image: "/images/instructor-3.jpg",
        },
        price: 69.99,
        rating: 4.7,
        enrollmentCount: 0,
        lessons: [],
      },
    ];

    const createdCourses = await Course.insertMany(courses);

    return NextResponse.json({
      message: "Courses seeded successfully",
      count: createdCourses.length,
    });
  } catch (error) {
    console.error("Error seeding courses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();

    const totalCount = await Course.countDocuments();
    const publishedCount = await Course.countDocuments({ isPublished: true });
    const draftCount = await Course.countDocuments({ isPublished: false });

    return NextResponse.json({
      success: true,
      count: totalCount,
      published: publishedCount,
      draft: draftCount,
    });
  } catch (error) {
    console.error("Error getting course stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get course stats: " + error.message,
      },
      { status: 500 }
    );
  }
}
