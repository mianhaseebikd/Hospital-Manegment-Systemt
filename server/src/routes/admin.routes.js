import express from "express";
import {
  getCurrentAdmin,
  getHospitalProfile,
  loginAdmin,
  registerAdmin,
  updateAdminProfile,
  updateHospitalProfile,
  uploadHospitalLogo
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

const hospitalUploadFolder = (req, res, next) => {
  req.uploadType = "hospital";
  next();
};

const adminUploadFolder = (req, res, next) => {
  req.uploadType = "admin";
  next();
};

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", getCurrentAdmin);
router.put("/profile", adminUploadFolder, upload.single("profileImage"), updateAdminProfile);

router.get("/hospital-profile", getHospitalProfile);
router.put("/hospital-profile", updateHospitalProfile);
router.post("/hospital-profile/logo", hospitalUploadFolder, upload.single("logo"), uploadHospitalLogo);

export default router;
