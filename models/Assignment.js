import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an assignment title"],
      trim: true,
      maxlength: [100, "Assignment title cannot be more than 100 characters"],
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Please provide a lesson"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    description: {
      type: String,
      required: [true, "Please provide an assignment description"],
      maxlength: [
        2000,
        "Assignment description cannot be more than 2000 characters",
      ],
    },
    dueDate: {
      type: Date,
    },
    totalPoints: {
      type: Number,
      default: 100,
    },
    passingScore: {
      type: Number,
      default: 70,
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
    submissions: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        submissionUrl: String,
        submissionText: String,
        score: Number,
        feedback: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        gradedAt: Date,
        status: {
          type: String,
          enum: ["pending", "graded", "late"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);
