import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a lesson title"],
      trim: true,
      maxlength: [100, "Lesson title cannot be more than 100 characters"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "Please provide a section"],
    },
    description: {
      type: String,
      maxlength: [500, "Lesson description cannot be more than 500 characters"],
    },
    videoUrl: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
    },
    order: {
      type: Number,
      required: [true, "Please provide a lesson order"],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ["pdf", "doc", "zip", "link", "image", "other"],
        },
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
