import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for certificate"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required for certificate"],
    },
    certificateNumber: {
      type: String,
      required: [true, "Certificate number is required"],
      unique: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
      required: [true, "Completion date is required"],
    },
    templateVersion: {
      type: String,
      default: "1.0",
    },
    verificationCode: {
      type: String,
      required: [true, "Verification code is required"],
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    issuer: {
      name: {
        type: String,
        default: "E-Xtra LMS",
      },
      signature: {
        type: String,
      },
      logo: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

// Static method to generate unique certificate number
CertificateSchema.statics.generateCertificateNumber = function () {
  const prefix = "CERT";
  const timestamp = Date.now().toString().substring(6); // Use last 7 digits of timestamp
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0"); // Random 4-digit number
  return `${prefix}-${timestamp}-${random}`;
};

// Static method to generate verification code
CertificateSchema.statics.generateVerificationCode = function () {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
};

// Create a unique compound index to prevent duplicate certificates
CertificateSchema.index({ user: 1, course: 1 }, { unique: true });

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", CertificateSchema);

export default Certificate;
