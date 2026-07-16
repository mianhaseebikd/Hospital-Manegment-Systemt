import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true
    },
    cnic: {
      type: String,
      required: [true, "CNIC is required"],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    specialization: {
      type: String,
      default: "",
      trim: true
    },
    bio: {
      type: String,
      default: "",
      trim: true
    },
    profileImageUrl: {
      type: String,
      default: "",
      trim: true
    },
    coverImageUrl: {
      type: String,
      default: "",
      trim: true
    },
    qualifications: {
      type: [String],
      default: []
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: 0
    },
    dutyTimings: {
      type: String,
      default: "",
      trim: true
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: 0
    },
    salaryType: {
      type: String,
      enum: ["Fixed", "Commission"],
      default: "Fixed"
    },
    baseSalary: {
      type: Number,
      default: 0,
      min: 0
    },
    commissionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

doctorSchema.index({ fullName: 1 });
doctorSchema.index({ specialization: 1 });

doctorSchema.index({ department: 1 });

export const Doctor = mongoose.model("Doctor", doctorSchema);
