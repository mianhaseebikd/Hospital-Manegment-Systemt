import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
      lowercase: true,
      trim: true,
      unique: true
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    username: {
      type: String,
      default: "",
      trim: true
    },
    cnic: {
      type: String,
      default: "",
      trim: true
    },
    role: {
      type: String,
      default: "hospital_admin",
      enum: ["hospital_admin"]
    },
    bio: {
      type: String,
      default: "",
      trim: true
    },
    profileImage: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
