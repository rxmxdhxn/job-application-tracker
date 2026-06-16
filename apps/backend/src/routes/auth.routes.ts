import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
  uploadCv,
  deleteCv,
} from "../controllers/auth.controller.js";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware.js";
import path from "path";

//avatarStorage
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

//avatarupload
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya JPG, PNG diizinkan"));
    }
  },
});

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const cvUpload = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya PDF, DOC, DOCX yang diizinkan"));
    }
  },
});

const router = Router();

router.get("/me", authMiddleware, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);
router.put(
  "/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  uploadAvatar,
);
router.put("/cv", authMiddleware, cvUpload.single("cv"), uploadCv);
router.delete("/cv", authMiddleware, deleteCv);

export { router as default };

