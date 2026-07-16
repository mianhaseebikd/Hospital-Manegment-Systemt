import { Admin } from "../models/admin.model.js";
import { Hospital } from "../models/hospital.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteOldImage } from "../middlewares/upload.middleware.js";

const DEFAULT_ADMIN = {
  fullName: "",
  email: "",
  phone: "",
  username: "",
  role: "hospital_admin"
};

const DEFAULT_HOSPITAL = {
  name: "",
  slug: "",
  tagline: "",
  legalName: "",
  registrationNumber: "",
  bio: "",
  logo: "",
  website: "",
  contactEmail: "",
  contactPhone: "",
  emergencyPhone: "",
  address: "",
  city: "",
  country: "",
  establishedYear: null,
  establishedDate: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
  ceoName: "",
  ceoEmail: "",
  ceoPhone: "",
  workingHours: "",
  opdStartTime: "",
  opdEndTime: "",
  timezone: "",
  currency: "",
  themeColor: "",
  setupVersion: "hospital-only-v1",
  isActive: ""
};

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || `hospital-${Date.now()}`;

const publicAdmin = (admin) => ({
  _id: admin?._id,
  fullName: admin?.fullName || "",
  email: admin?.email || "",
  phone: admin?.phone || "",
  username: admin?.username || "",
  role: "hospital_admin",
  bio: admin?.bio || "",
  profileImage: admin?.profileImage || ""
});

const publicHospital = (hospital) => ({
  _id: hospital?._id,
  name: hospital?.name || DEFAULT_HOSPITAL.name,
  slug: hospital?.slug || "",
  tagline: hospital?.tagline || DEFAULT_HOSPITAL.tagline,
  legalName: hospital?.legalName || "",
  registrationNumber: hospital?.registrationNumber || "",
  bio: hospital?.bio || "",
  logo: hospital?.logo || "",
  website: hospital?.website || "",
  contactEmail: hospital?.contactEmail || "",
  contactPhone: hospital?.contactPhone || "",
  emergencyPhone: hospital?.emergencyPhone || "",
  address: hospital?.address || "",
  city: hospital?.city || "",
  country: hospital?.country || "",
  establishedYear: hospital?.establishedYear || "",
  establishedDate: hospital?.establishedDate || "",
  adminName: hospital?.adminName || "",
  adminEmail: hospital?.adminEmail || "",
  adminPhone: hospital?.adminPhone || "",
  ceoName: hospital?.ceoName || "",
  ceoEmail: hospital?.ceoEmail || "",
  ceoPhone: hospital?.ceoPhone || "",
  workingHours: hospital?.workingHours || "",
  opdStartTime: hospital?.opdStartTime || "",
  opdEndTime: hospital?.opdEndTime || "",
  timezone: hospital?.timezone || "",
  currency: hospital?.currency || "",
  themeColor: hospital?.themeColor || "",
  setupVersion: hospital?.setupVersion || DEFAULT_HOSPITAL.setupVersion,
  isActive: hospital?.isActive ?? "",
  createdAt: hospital?.createdAt,
  updatedAt: hospital?.updatedAt
});

const getOrCreateHospital = async () => {
  const existing = await Hospital.findOne().sort({ createdAt: 1 });
  if (existing) {
    const legacyFields = ["subscription", "enabledModules", "communicationSettings", "featurePermissions", "locations", "gallery"];
    const hasLegacyFields = legacyFields.some((field) => existing.get(field) !== undefined);
    const needsHospitalOnlyReset = existing.setupVersion !== DEFAULT_HOSPITAL.setupVersion;

    if (hasLegacyFields || needsHospitalOnlyReset) {
      return Hospital.findByIdAndUpdate(
        existing._id,
        {
          $set: { setupVersion: DEFAULT_HOSPITAL.setupVersion },
          $unset: legacyFields.reduce((fields, field) => ({ ...fields, [field]: "" }), {})
        },
        { new: true, runValidators: true }
      );
    }

    return existing;
  }
  return null;
};

const getOrCreateAdmin = async (payload = {}) => {
  const existing = await Admin.findOne().sort({ createdAt: 1 });
  if (existing) {
    const hasPayload = Object.keys(payload).length > 0;
    if (!hasPayload) return existing;
    const updates = {
      fullName: payload.fullName || existing.fullName,
      email: payload.email || existing.email,
      phone: payload.phone ?? existing.phone,
      username: payload.username ?? existing.username,
      role: "hospital_admin",
      isActive: true
    };
    return Admin.findByIdAndUpdate(existing._id, updates, { new: true, runValidators: true });
  }

  if (!payload.fullName || !payload.email) return null;

  return Admin.create({
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone || "",
    username: payload.username || "",
    role: "hospital_admin",
    isActive: true
  });
};

const buildSession = async (admin) => {
  const hospital = await getOrCreateHospital();
  return {
    user: publicAdmin(admin),
    role: "hospital_admin",
    hospital: hospital ? publicHospital(hospital) : null,
    accessToken: "dummy-admin-session",
    refreshToken: "dummy-admin-refresh"
  };
};

export const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, phone, username, hospitalName } = req.body || {};

  if (!hospitalName || !fullName || !email) {
    return res.status(400).json(new ApiResponse(400, null, "Hospital name, admin name and email are required"));
  }

  const admin = await getOrCreateAdmin({ fullName, email, phone, username });
  let hospital = await Hospital.findOne().sort({ createdAt: 1 });

  if (!hospital) {
    hospital = await Hospital.create({
      name: hospitalName,
      slug: slugify(hospitalName),
      legalName: "",
      adminName: fullName,
      adminEmail: email,
      adminPhone: phone || "",
      setupVersion: DEFAULT_HOSPITAL.setupVersion
    });
  } else {
    hospital.name = hospitalName;
    if (!hospital.slug || hospital.slug === "primary-hospital") {
      hospital.slug = slugify(hospitalName);
    }
    hospital.adminName = fullName;
    hospital.adminEmail = email;
    hospital.adminPhone = phone || "";
    hospital.setupVersion = DEFAULT_HOSPITAL.setupVersion;
    await hospital.save();
  }

  return res.status(201).json(new ApiResponse(201, await buildSession(admin), "Admin registered"));
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  let admin = await Admin.findOne(email ? { email: String(email).toLowerCase().trim() } : {}).sort({ createdAt: 1 });

  if (!admin) {
    return res.status(404).json(new ApiResponse(404, null, "Admin not registered"));
  }

  return res.status(200).json(new ApiResponse(200, await buildSession(admin), "Logged in with dummy admin"));
});

export const getCurrentAdmin = asyncHandler(async (req, res) => {
  const admin = await getOrCreateAdmin();
  if (!admin) return res.status(404).json(new ApiResponse(404, null, "Admin not registered"));
  return res.status(200).json(new ApiResponse(200, await buildSession(admin), "Current admin"));
});

export const updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await getOrCreateAdmin();
  if (!admin) return res.status(404).json(new ApiResponse(404, null, "Admin not registered"));
  const allowed = ["fullName", "email", "phone", "username", "bio"];
  const updates = {};

  allowed.forEach((field) => {
    if (req.body?.[field] !== undefined) updates[field] = req.body[field];
  });

  if (req.file) {
    deleteOldImage(admin.profileImage);
    updates.profileImage = req.file.path.replace(/\\/g, "/");
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(admin._id, updates, {
    new: true,
    runValidators: true
  });

  return res.status(200).json(new ApiResponse(200, publicAdmin(updatedAdmin), "Admin profile updated"));
});

export const getHospitalProfile = asyncHandler(async (req, res) => {
  const hospital = await getOrCreateHospital();
  if (!hospital) return res.status(404).json(new ApiResponse(404, null, "Hospital profile not registered"));
  return res.status(200).json(new ApiResponse(200, { hospital: publicHospital(hospital) }, "Hospital profile"));
});

export const updateHospitalProfile = asyncHandler(async (req, res) => {
  const hospital = await getOrCreateHospital();
  if (!hospital) return res.status(404).json(new ApiResponse(404, null, "Hospital profile not registered"));
  const allowed = [
    "name",
    "tagline",
    "legalName",
    "registrationNumber",
    "bio",
    "website",
    "contactEmail",
    "contactPhone",
    "emergencyPhone",
    "address",
    "city",
    "country",
    "establishedYear",
    "establishedDate",
    "adminName",
    "adminEmail",
    "adminPhone",
    "ceoName",
    "ceoEmail",
    "ceoPhone",
    "workingHours",
    "opdStartTime",
    "opdEndTime",
    "timezone",
    "currency",
    "themeColor",
    "isActive"
  ];

  const updates = {};
  allowed.forEach((field) => {
    if (field === "isActive" && req.body?.[field] === "") return;
    if (req.body?.[field] !== undefined) updates[field] = req.body[field];
  });

  if (updates.name && !updates.legalName && !hospital.legalName) {
    updates.legalName = updates.name;
  }

  const updatedHospital = await Hospital.findByIdAndUpdate(
    hospital._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res.status(200).json(new ApiResponse(200, { hospital: publicHospital(updatedHospital) }, "Hospital profile updated"));
});

export const uploadHospitalLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, "Logo file is required"));
  }

  const hospital = await getOrCreateHospital();
  deleteOldImage(hospital.logo);
  hospital.logo = req.file.path.replace(/\\/g, "/");
  await hospital.save();

  return res.status(200).json(new ApiResponse(200, { hospital: publicHospital(hospital) }, "Hospital logo updated"));
});
