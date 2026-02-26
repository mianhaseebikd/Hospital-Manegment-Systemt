import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all admins
export const getAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find();
    res.json(new ApiResponse(200, admins, "Admins fetched"));
});

// Create admin
export const createAdmin = asyncHandler(async (req, res) => {
    const { fullName, username, email, phone, cnic, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) throw new Error("Admin with this email already exists");

    const admin = new Admin({ fullName, username, email, phone, cnic, password });
    await admin.save();
    res.json(new ApiResponse(201, admin, "Successfully created a new Admin"));
});
