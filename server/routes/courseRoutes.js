import express from "express";
import { updateCourseProgress } from "../controllers/courseProgressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:courseId/progress", protect, updateCourseProgress);

export default router;