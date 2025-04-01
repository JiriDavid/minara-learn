import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a discussion title"],
      trim: true,
      maxlength: [200, "Discussion title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide discussion content"],
      maxlength: [
        5000,
        "Discussion content cannot be more than 5000 characters",
      ],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        content: {
          type: String,
          required: [true, "Please provide reply content"],
          maxlength: [
            2000,
            "Reply content cannot be more than 2000 characters",
          ],
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Please provide a user"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        upvotes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        isAnswer: {
          type: Boolean,
          default: false,
        },
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Discussion ||
  mongoose.model("Discussion", DiscussionSchema);
