import mongoose from "mongoose";

const CompletionSchema = new mongoose.Schema(
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
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only complete a lesson once
CompletionSchema.index({ user: 1, lesson: 1 }, { unique: true });

// Check if the model already exists before creating it (for Next.js hot-reloading)
const Completion = mongoose.models.Completion || mongoose.model("Completion", CompletionSchema);

export default Completion; 