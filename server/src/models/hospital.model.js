import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true
    },
    tagline: {
      type: String,
      default: "",
      trim: true
    },
    legalName: {
      type: String,
      default: "",
      trim: true
    },
    registrationNumber: {
      type: String,
      default: "",
      trim: true
    },
    bio: {
      type: String,
      default: "",
      trim: true
    },
    logo: {
      type: String,
      default: ""
    },
    website: {
      type: String,
      default: "",
      trim: true
    },
    contactEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true
    },
    contactPhone: {
      type: String,
      default: "",
      trim: true
    },
    emergencyPhone: {
      type: String,
      default: "",
      trim: true
    },
    address: {
      type: String,
      default: "",
      trim: true
    },
    city: {
      type: String,
      default: "",
      trim: true
    },
    country: {
      type: String,
      default: "",
      trim: true
    },
    establishedYear: {
      type: Number,
      default: null
    },
    establishedDate: {
      type: String,
      default: "",
      trim: true
    },
    adminName: {
      type: String,
      default: "",
      trim: true
    },
    adminEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true
    },
    adminPhone: {
      type: String,
      default: "",
      trim: true
    },
    ceoName: {
      type: String,
      default: "",
      trim: true
    },
    ceoEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true
    },
    ceoPhone: {
      type: String,
      default: "",
      trim: true
    },
    workingHours: {
      type: String,
      default: "",
      trim: true
    },
    opdStartTime: {
      type: String,
      default: "",
      trim: true
    },
    opdEndTime: {
      type: String,
      default: "",
      trim: true
    },
    timezone: {
      type: String,
      default: "",
      trim: true
    },
    currency: {
      type: String,
      default: "",
      trim: true
    },
    themeColor: {
      type: String,
      default: "",
      trim: true
    },
    setupVersion: {
      type: String,
      default: "hospital-only-v1",
      trim: true
    },
    isActive: {
      type: Boolean
    }
  },
  { timestamps: true }
);

hospitalSchema.index({ isActive: 1 });

export const Hospital = mongoose.model("Hospital", hospitalSchema);
