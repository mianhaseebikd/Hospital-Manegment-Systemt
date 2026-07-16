import { Department } from "../models/department.model.js";
import { Hospital } from "../models/hospital.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteOldImage } from "../middlewares/upload.middleware.js";

const getHospital = async () => Hospital.findOne().sort({ createdAt: 1 });

const slugifyCode = (name) =>
  String(name || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 12) || "DEPT";

const publicDepartment = (department) => ({
  _id: department?._id,
  hospitalId: department?.hospitalId,
  name: department?.name || "",
  code: department?.code || "",
  description: department?.description || "",
  icon: department?.icon || "",
  isActive: department?.isActive ?? true,
  isPrimary: department?.isPrimary ?? false,
  createdAt: department?.createdAt,
  updatedAt: department?.updatedAt
});

const requireHospital = async (res) => {
  const hospital = await getHospital();
  if (!hospital) {
    res.status(404).json(new ApiResponse(404, null, "Register hospital first"));
    return null;
  }
  return hospital;
};

export const listDepartments = asyncHandler(async (req, res) => {
  const hospital = await requireHospital(res);
  if (!hospital) return;

  const { q = "", status = "all" } = req.query || {};
  const filter = { hospitalId: hospital._id };

  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;

  if (q.trim()) {
    const regex = new RegExp(q.trim(), "i");
    filter.$or = [{ name: regex }, { code: regex }, { description: regex }];
  }

  const departments = await Department.find(filter).sort({ createdAt: -1 }).lean();
  const stats = {
    total: await Department.countDocuments({ hospitalId: hospital._id }),
    active: await Department.countDocuments({ hospitalId: hospital._id, isActive: true }),
    inactive: await Department.countDocuments({ hospitalId: hospital._id, isActive: false })
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      { departments: departments.map(publicDepartment), stats },
      "Departments fetched"
    )
  );
});

export const getDepartment = asyncHandler(async (req, res) => {
  const hospital = await requireHospital(res);
  if (!hospital) return;

  const department = await Department.findOne({ _id: req.params.id, hospitalId: hospital._id }).lean();
  if (!department) return res.status(404).json(new ApiResponse(404, null, "Department not found"));

  return res.status(200).json(new ApiResponse(200, publicDepartment(department), "Department fetched"));
});

export const createDepartment = asyncHandler(async (req, res) => {
  const hospital = await requireHospital(res);
  if (!hospital) return;

  const { name, code, description, isActive, isPrimary } = req.body || {};
  if (!name?.trim()) {
    return res.status(400).json(new ApiResponse(400, null, "Department name is required"));
  }

  try {
    // If this department is set as primary, unset other primaries for this hospital
    if (isPrimary) {
      await Department.updateMany({ hospitalId: hospital._id }, { $set: { isPrimary: false } });
    }

    const department = await Department.create({
      hospitalId: hospital._id,
      name: name.trim(),
      code: code?.trim()?.toUpperCase() || slugifyCode(name),
      description: description || "",
      isActive: isActive !== false,
      isPrimary: !!isPrimary
    });

    return res.status(201).json(new ApiResponse(201, publicDepartment(department), "Department created"));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json(new ApiResponse(409, null, "Department already exists"));
    }
    throw err;
  }
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const hospital = await requireHospital(res);
  if (!hospital) return;

  const updates = {};
  ["name", "code", "description", "isActive", "isPrimary"].forEach((field) => {
    if (req.body?.[field] !== undefined) updates[field] = req.body[field];
  });

  if (updates.name) updates.name = updates.name.trim();
  if (updates.code) updates.code = updates.code.trim().toUpperCase();
  if (!updates.code && updates.name) updates.code = slugifyCode(updates.name);

  try {
    // If setting this department as primary, clear others first
    if (updates.isPrimary) {
      await Department.updateMany({ hospitalId: hospital._id }, { $set: { isPrimary: false } });
    }

    const department = await Department.findOneAndUpdate(
      { _id: req.params.id, hospitalId: hospital._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!department) return res.status(404).json(new ApiResponse(404, null, "Department not found"));
    return res.status(200).json(new ApiResponse(200, publicDepartment(department), "Department updated"));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json(new ApiResponse(409, null, "Department already exists"));
    }
    throw err;
  }
});

export const toggleDepartment = asyncHandler(async (req, res) => {
  const hospital = await requireHospital(res);
  if (!hospital) return;

  const department = await Department.findOne({ _id: req.params.id, hospitalId: hospital._id });
  if (!department) return res.status(404).json(new ApiResponse(404, null, "Department not found"));

  department.isActive = !department.isActive;
  await department.save();

  return res.status(200).json(new ApiResponse(200, publicDepartment(department), "Department status updated"));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const hospital = await requireHospital(res);
  if (!hospital) return;

  const department = await Department.findOneAndDelete({ _id: req.params.id, hospitalId: hospital._id });
  if (!department) return res.status(404).json(new ApiResponse(404, null, "Department not found"));

  deleteOldImage(department.icon);
  return res.status(200).json(new ApiResponse(200, { id: req.params.id }, "Department deleted"));
});

export const uploadDepartmentIcon = asyncHandler(async (req, res) => {
  const hospital = await requireHospital(res);
  if (!hospital) return;

  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, "Department icon is required"));
  }

  const department = await Department.findOne({ _id: req.params.id, hospitalId: hospital._id });
  if (!department) return res.status(404).json(new ApiResponse(404, null, "Department not found"));

  deleteOldImage(department.icon);
  department.icon = req.file.path.replace(/\\/g, "/");
  await department.save();

  return res.status(200).json(new ApiResponse(200, publicDepartment(department), "Department icon uploaded"));
});
