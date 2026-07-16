import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartments,
  toggleDepartment,
  updateDepartment,
  uploadDepartmentIcon
} from "../controllers/department.simple.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

const departmentUploadFolder = (req, res, next) => {
  req.uploadType = "department";
  next();
};

router.get("/", listDepartments);
router.post("/", createDepartment);
router.get("/:id", getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);
router.patch("/:id/toggle", toggleDepartment);
router.post("/:id/icon", departmentUploadFolder, upload.single("icon"), uploadDepartmentIcon);

export default router;
