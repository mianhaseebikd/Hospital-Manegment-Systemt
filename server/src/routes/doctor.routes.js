import express from "express";
import { createDoctor, deleteDoctor, getDoctor, listDoctors, updateDoctor } from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/", listDoctors);
router.post("/", createDoctor);
router.get("/:id", getDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
