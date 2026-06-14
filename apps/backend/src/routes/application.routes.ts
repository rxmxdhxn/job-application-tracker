import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/application.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);

export { router as default };
