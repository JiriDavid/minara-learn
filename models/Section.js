import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a section title"],
      trim: true,
      maxlength: [100, "Section title cannot be more than 100 characters"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    description: {
      type: String,
      maxlength: [
        500,
        "Section description cannot be more than 500 characters",
      ],
    },
    order: {
      type: Number,
      required: [true, "Please provide a section order"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate lessons in section
SectionSchema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "sectionId",
  justOne: false,
});

export default mongoose.models.Section ||
  mongoose.model("Section", SectionSchema);
