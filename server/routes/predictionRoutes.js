import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { predictMyCareer } from "../controllers/predictionController.js";

const router = express.Router();

router.post("/me", protect, predictMyCareer);

export default router;