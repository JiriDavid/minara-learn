import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a quiz title"],
      trim: true,
      maxlength: [100, "Quiz title cannot be more than 100 characters"],
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
      maxlength: [500, "Quiz description cannot be more than 500 characters"],
    },
    passingScore: {
      type: Number,
      required: [true, "Please provide a passing score"],
      min: 0,
      max: 100,
      default: 70,
    },
    timeLimit: {
      type: Number, // in minutes
      default: 0, // 0 means no time limit
    },
    questions: [
      {
        text: {
          type: String,
          required: [true, "Please provide a question"],
        },
        options: [
          {
            text: {
              type: String,
              required: [true, "Please provide an option"],
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],
        type: {
          type: String,
          enum: ["single", "multiple"],
          default: "single",
        },
        points: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
