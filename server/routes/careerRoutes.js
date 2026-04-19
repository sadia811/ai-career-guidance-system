import express from "express";
import {
    getAllCareers,
    getPopularCareers,
    getCareerDetails,
    toggleSavedCareer,
    getMySavedCareers,
    setCareerGoal,
    getCareerCourses,
} from "../controllers/careerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/popular", getPopularCareers);
router.get("/saved/me", protect, getMySavedCareers);
router.get("/", getAllCareers);
router.get("/:careerId", getCareerDetails);
router.get("/:careerId/courses", protect, getCareerCourses);
router.post("/:careerId/save", protect, toggleSavedCareer);
router.post("/:careerId/set-goal", protect, setCareerGoal);

export default router;