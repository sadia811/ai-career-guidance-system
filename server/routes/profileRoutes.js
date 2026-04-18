import express from "express";
import { getMyProfile, saveProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.post("/", protect, saveProfile);

export default router;