import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getMyAccountSettings,
    updateMyAccountSettings,
    deleteMyAccount,
} from "../controllers/userSettingsController.js";

const router = express.Router();

router.get("/me", protect, getMyAccountSettings);
router.patch("/me", protect, updateMyAccountSettings);
router.delete("/me", protect, deleteMyAccount);

export default router;