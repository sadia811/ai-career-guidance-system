import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        degree: {
            type: String,
            default: "",
            trim: true,
        },
        major: {
            type: String,
            default: "",
            trim: true,
        },
        technicalSkills: {
            type: [String],
            default: [],
        },
        softSkills: {
            type: [String],
            default: [],
        },
        careerInterests: {
            type: [String],
            default: [],
        },
        experienceTags: {
            type: [String],
            default: [],
        },
        experienceText: {
            type: String,
            default: "",
            trim: true,
        },
        profileCompletion: {
            type: Number,
            default: 0,
        },
        savedCareers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Career",
            },
        ],
        careerGoal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Career",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;