import express from "express";
import { getAllCareers, getPopularCareers } from "../controllers/careerController.js";

const router = express.Router();

router.get("/", getAllCareers);
router.get("/popular", getPopularCareers);

export default router;