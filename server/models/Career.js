import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: "",
        },
        salaryMin: {
            type: Number,
            default: 0,
        },
        salaryMax: {
            type: Number,
            default: 0,
        },
        requiredSkills: {
            type: [String],
            default: [],
        },
        industry: {
            type: String,
            default: "",
        },
        popularityScore: {
            type: Number,
            default: 0,
        },
        isPopular: {
            type: Boolean,
            default: false,
        },
        source: {
            type: String,
            default: "",
        },
        lastSyncedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Career = mongoose.model("Career", careerSchema);

export default Career;