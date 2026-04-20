import mongoose from "mongoose";

const roadmapProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        career: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Career",
            required: true,
        },
        completedSteps: {
            type: [String],
            default: [],
        },
        lastViewedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

roadmapProgressSchema.index({ user: 1, career: 1 }, { unique: true });

const RoadmapProgress = mongoose.model("RoadmapProgress", roadmapProgressSchema);

export default RoadmapProgress;