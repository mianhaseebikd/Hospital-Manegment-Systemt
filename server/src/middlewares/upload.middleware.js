import multer from "multer";
import fs from "fs";
import path from "path";

// ---------- Create folders automatically ----------
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const sanitizeFolderName = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

const resolveUploadType = (req) => {
  const explicitType = req.uploadType || req.body?.type;
  if (explicitType) return sanitizeFolderName(explicitType);

  const routeType = req.baseUrl?.split("/").filter(Boolean).pop();
  if (routeType) return sanitizeFolderName(routeType);

  return "others";
};

// ---------- Storage Configuration ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = resolveUploadType(req) || "others";
    const mainFolder = "uploads";
    const uploadFolder = path.posix.join(mainFolder, type);

    // create folder if not exists
    ensureFolderExists(uploadFolder);

    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

// ---------- File Type Filter ----------
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp|gif|pdf|doc|docx|xls|xlsx/;

  // File extension
  const ext = path.extname(file.originalname).toLowerCase();
  const extValid = allowed.test(ext);

  if (extValid) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only Images, PDF, Word & Excel files are allowed."));
  }
};

// ---------- Multer Upload Middleware ----------
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// ---------- Helper: Delete Old Image ----------
export const deleteOldImage = (filePath) => {
  if (!filePath) return;

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.log("Error deleting old image:", err);
    });
  }
};
