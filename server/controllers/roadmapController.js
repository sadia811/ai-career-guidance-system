import Career from "../models/Career.js";
import RoadmapProgress from "../models/RoadmapProgress.js";

// GET /api/roadmap/progress/:careerId
export const getRoadmapProgress = async (req, res) => {
    try {
        const { careerId } = req.params;

        const career = await Career.findById(careerId).select("_id title");
        if (!career) {
            return res.status(404).json({
                message: "Career not found",
            });
        }

        let progress = await RoadmapProgress.findOne({
            user: req.user._id,
            career: careerId,
        });

        if (!progress) {
            progress = await RoadmapProgress.create({
                user: req.user._id,
                career: careerId,
                completedSteps: [],
            });
        }

        return res.status(200).json({
            message: "Roadmap progress fetched successfully",
            progress,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while fetching roadmap progress",
            error: error.message,
        });
    }
};

// PATCH /api/roadmap/progress/:careerId/step
export const updateRoadmapStepProgress = async (req, res) => {
    try {
        const { careerId } = req.params;
        const { stepKey, completed } = req.body;

        if (!stepKey || typeof stepKey !== "string") {
            return res.status(400).json({
                message: "stepKey is required",
            });
        }

        const career = await Career.findById(careerId).select("_id title");
        if (!career) {
            return res.status(404).json({
                message: "Career not found",
            });
        }

        let progress = await RoadmapProgress.findOne({
            user: req.user._id,
            career: careerId,
        });

        if (!progress) {
            progress = await RoadmapProgress.create({
                user: req.user._id,
                career: careerId,
                completedSteps: [],
            });
        }

        const currentSteps = new Set(progress.completedSteps || []);

        if (completed) {
            currentSteps.add(stepKey);
        } else {
            currentSteps.delete(stepKey);
        }

        progress.completedSteps = [...currentSteps];
        progress.lastViewedAt = new Date();

        await progress.save();

        return res.status(200).json({
            message: completed
                ? "Roadmap step marked as completed"
                : "Roadmap step marked as incomplete",
            progress,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating roadmap progress",
            error: error.message,
        });
    }
};