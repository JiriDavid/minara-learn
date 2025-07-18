import mongoose from "mongoose";
import slugify from "slugify";

// Define the schema for a lesson
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["video", "text", "quiz", "assignment"],
      default: "video",
    },
    content: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    order: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        title: String,
        type: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

// Define the schema for a section (group of lessons)
const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

// Main course schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [String],
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels",
    },
    language: {
      type: String,
      default: "English",
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    sections: [sectionSchema],
    requirements: [String],
    objectives: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
      distribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },
    totalDuration: {
      type: Number, // in minutes
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create slug from title before saving
courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Calculate total lessons and duration
  if (this.isModified("sections")) {
    let totalLessons = 0;
    let totalDuration = 0;

    this.sections.forEach((section) => {
      totalLessons += section.lessons.length;
      section.lessons.forEach((lesson) => {
        totalDuration += lesson.duration || 0;
      });
    });

    this.totalLessons = totalLessons;
    this.totalDuration = totalDuration;
  }

  // Set publishedAt date when course is published
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Create an index on the title field for better search performance
courseSchema.index({ title: "text", description: "text", tags: "text" });

// Create a model if it doesn't already exist
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
