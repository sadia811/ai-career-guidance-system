import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getRoadmapProgress,
    updateRoadmapStepProgress,
} from "../controllers/roadmapController.js";

const router = express.Router();

router.get("/progress/:careerId", protect, getRoadmapProgress);
router.patch("/progress/:careerId/step", protect, updateRoadmapStepProgress);

export default router;