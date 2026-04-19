import mongoose from "mongoose";

const salaryTrendPointSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

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
            trim: true,
        },
        overview: {
            type: [String],
            default: [],
        },
        industry: {
            type: String,
            default: "",
            trim: true,
        },
        experienceLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Intermediate",
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
        jobRoles: {
            type: [String],
            default: [],
        },
        companies: {
            type: [String],
            default: [],
        },
        salaryTrendLabel: {
            type: String,
            default: "+0%",
        },
        salaryTrendPoints: {
            type: [salaryTrendPointSchema],
            default: [],
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
            trim: true,
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