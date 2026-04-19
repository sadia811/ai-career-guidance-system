import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        provider: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        careers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Career",
            },
        ],
        skillsCovered: {
            type: [String],
            default: [],
        },
        difficulty: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },
        durationHours: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;