import { Doctor } from "../models/doctor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const publicDoctor = (doctor) => ({
  _id: doctor?._id,
  fullName: doctor?.fullName || "",
  phone: doctor?.phone || "",
  cnic: doctor?.cnic || "",
  email: doctor?.email || "",
  specialization: doctor?.specialization || "",
  bio: doctor?.bio || "",
  profileImageUrl: doctor?.profileImageUrl || "",
  coverImageUrl: doctor?.coverImageUrl || "",
  qualifications: doctor?.qualifications || [],
  experienceYears: doctor?.experienceYears || 0,
  dutyTimings: doctor?.dutyTimings || "",
  consultationFee: doctor?.consultationFee || 0,
  salaryType: doctor?.salaryType || "Fixed",
  baseSalary: doctor?.baseSalary || 0,
  commissionPercentage: doctor?.commissionPercentage || 0,
  createdAt: doctor?.createdAt,
  updatedAt: doctor?.updatedAt
});

const normalizeQualifications = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRegex = /^\+?[0-9][0-9\s()-]{6,18}$/;
const cnicRegex = /^(\d{13}|\d{5}-\d{7}-\d{1})$/;

const validateDoctorBasics = (payload, requireAll = false) => {
  const errors = {};
  const has = (field) => payload?.[field] !== undefined;

  if ((requireAll || has("fullName")) && !payload.fullName?.trim()) {
    errors.fullName = "Doctor name is required.";
  }

  if (requireAll || has("email")) {
    if (!payload.email?.trim()) errors.email = "Email is required.";
    else if (!emailRegex.test(payload.email.trim())) errors.email = "Enter a valid email address.";
  }

  if (requireAll || has("phone")) {
    if (!payload.phone?.trim()) errors.phone = "Phone number is required.";
    else if (!phoneRegex.test(payload.phone.trim())) errors.phone = "Enter a valid phone number.";
  }

  if (requireAll || has("cnic")) {
    if (!payload.cnic?.trim()) errors.cnic = "CNIC is required.";
    else if (!cnicRegex.test(payload.cnic.trim())) errors.cnic = "Use 13 digits or XXXXX-XXXXXXX-X format.";
  }

  return errors;
};

const hasValidationErrors = (errors) => Object.keys(errors).length > 0;

export const createDoctor = asyncHandler(async (req, res) => {
  const { fullName, email, phone, cnic } = req.body || {};
  const validationErrors = validateDoctorBasics(req.body, true);

  if (hasValidationErrors(validationErrors)) {
    return res.status(422).json(new ApiResponse(422, { errors: validationErrors }, "Please check the highlighted fields"));
  }

  try {
    const doctor = await Doctor.create({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      cnic: cnic.trim()
    });

    return res.status(201).json(new ApiResponse(201, publicDoctor(doctor), "Doctor created"));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json(new ApiResponse(409, null, "Doctor email or CNIC already exists"));
    }
    throw err;
  }
});

export const listDoctors = asyncHandler(async (req, res) => {
  const { q = "", specialization = "" } = req.query || {};
  const filter = {};

  if (q.trim()) {
    const regex = new RegExp(q.trim(), "i");
    filter.$or = [{ fullName: regex }, { email: regex }, { phone: regex }, { cnic: regex }, { specialization: regex }];
  }

  if (specialization.trim()) {
    filter.specialization = new RegExp(specialization.trim(), "i");
  }

  const doctors = await Doctor.find(filter).sort({ createdAt: -1 }).lean();
  return res.status(200).json(new ApiResponse(200, doctors.map(publicDoctor), "Doctors fetched"));
});

export const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).lean();
  if (!doctor) return res.status(404).json(new ApiResponse(404, null, "Doctor not found"));

  return res.status(200).json(new ApiResponse(200, publicDoctor(doctor), "Doctor fetched"));
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const allowed = [
    "fullName",
    "phone",
    "cnic",
    "email",
    "specialization",
    "bio",
    "profileImageUrl",
    "coverImageUrl",
    "qualifications",
    "experienceYears",
    "dutyTimings",
    "consultationFee",
    "salaryType",
    "baseSalary",
    "commissionPercentage"
  ];

  const updates = {};
  allowed.forEach((field) => {
    if (req.body?.[field] !== undefined) updates[field] = req.body[field];
  });

  const validationErrors = validateDoctorBasics(updates);
  if (hasValidationErrors(validationErrors)) {
    return res.status(422).json(new ApiResponse(422, { errors: validationErrors }, "Please check the highlighted fields"));
  }

  if (updates.qualifications !== undefined) {
    updates.qualifications = normalizeQualifications(updates.qualifications);
  }

  ["experienceYears", "consultationFee", "baseSalary", "commissionPercentage"].forEach((field) => {
    if (updates[field] !== undefined) updates[field] = Number(updates[field]) || 0;
  });

  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).lean();
    if (!doctor) return res.status(404).json(new ApiResponse(404, null, "Doctor not found"));

    return res.status(200).json(new ApiResponse(200, publicDoctor(doctor), "Doctor updated"));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json(new ApiResponse(409, null, "Doctor email or CNIC already exists"));
    }
    throw err;
  }
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json(new ApiResponse(404, null, "Doctor not found"));

  return res.status(200).json(new ApiResponse(200, { id: req.params.id }, "Doctor deleted"));
});
