import mongoose from "mongoose";

const userCourseProgressSchema = new mongoose.Schema(
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
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: ["not-started", "in-progress", "completed"],
            default: "not-started",
        },
        startedAt: {
            type: Date,
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

userCourseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

const UserCourseProgress = mongoose.model("UserCourseProgress", userCourseProgressSchema);

export default UserCourseProgress;