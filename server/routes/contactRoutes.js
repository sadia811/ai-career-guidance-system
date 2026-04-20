import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
    submitContactMessage,
    getAllContactMessages,
    markContactMessageRead,
    deleteContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContactMessage);

router.get("/admin/messages", protect, adminOnly, getAllContactMessages);
router.patch("/admin/messages/:messageId/read", protect, adminOnly, markContactMessageRead);
router.delete("/admin/messages/:messageId", protect, adminOnly, deleteContactMessage);

export default router;