import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateCourseProgress } from "../controllers/courseProgressController.js";

const router = express.Router();

router.post("/:courseId/progress", protect, updateCourseProgress);

export default router;