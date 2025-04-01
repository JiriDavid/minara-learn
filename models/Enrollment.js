import mongoose from "mongoose";

const CompletedLessonSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.Mixed, // Can store either an ObjectId or a lesson object
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const EnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped", "refunded"],
      default: "active",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      completed: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
        },
      ],
      lastAccessed: {
        lesson: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
      percentComplete: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    certificate: {
      issued: {
        type: Boolean,
        default: false,
      },
      issuedAt: {
        type: Date,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
    rating: {
      value: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: {
        type: String,
      },
      date: {
        type: Date,
      },
    },
    paymentInfo: {
      amount: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "refunded", "failed"],
        default: "pending",
      },
      processor: {
        type: String,
        enum: ["stripe", "paypal", "manual", "free"],
        default: "manual",
      },
      transactionId: {
        type: String,
      },
    },
    notes: {
      type: String,
    },
    completedLessons: [CompletedLessonSchema],
    currentLesson: {
      lessonId: {
        type: String,
      },
      sectionId: {
        type: String,
      },
      lastPosition: {
        type: Number, // For video position tracking (in seconds)
        default: 0,
      },
    },
  },
  { timestamps: true }
);

// Compound index to ensure a user can only enroll once in a course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Method to calculate progress percentage
EnrollmentSchema.methods.calculateProgress = async function () {
  const courseDocument = await mongoose.model("Course").findById(this.course);

  if (!courseDocument) return 0;

  // Get total lessons count from all sections
  let totalLessonsCount = 0;
  courseDocument.sections.forEach((section) => {
    totalLessonsCount += section.lessons.length;
  });

  if (totalLessonsCount === 0) return 0;

  // Calculate percentage based on completed lessons
  const completedCount = this.progress.completed.length;
  const percentage = Math.round((completedCount / totalLessonsCount) * 100);

  // Update the percentComplete field
  this.progress.percentComplete = percentage;

  return percentage;
};

// Pre-save hook to check if course is completed
EnrollmentSchema.pre("save", async function (next) {
  // If progress is 100% and status is not already completed, mark as completed
  if (this.progress.percentComplete === 100 && this.status !== "completed") {
    this.status = "completed";
    this.completedAt = new Date();
  }

  next();
});

// Create a model if it doesn't already exist
const Enrollment =
  mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

export default Enrollment;
