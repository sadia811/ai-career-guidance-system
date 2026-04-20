import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        completedSessions: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalSessions: {
            type: Number,
            default: 5,
            min: 1,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started",
        },
        lastOpenedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;