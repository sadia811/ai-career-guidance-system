import Profile from "../models/Profile.js";
import User from "../models/User.js";

const calculateProfileCompletion = (profileData) => {
    let score = 0;
    const totalSections = 6;

    if (profileData.degree && profileData.major) score += 1;
    if (profileData.technicalSkills?.length > 0) score += 1;
    if (profileData.softSkills?.length > 0) score += 1;
    if (profileData.careerInterests?.length > 0) score += 1;
    if (profileData.experienceTags?.length > 0) score += 1;
    if (profileData.experienceText?.trim()) score += 1;

    return Math.round((score / totalSections) * 100);
};

// POST /api/profile
export const saveProfile = async (req, res) => {
    try {
        const {
            degree,
            major,
            technicalSkills,
            softSkills,
            careerInterests,
            experienceTags,
            experienceText,
        } = req.body;

        if (!degree || !major) {
            return res.status(400).json({
                message: "Degree and major are required",
            });
        }

        if (!technicalSkills || technicalSkills.length === 0) {
            return res.status(400).json({
                message: "At least one technical skill is required",
            });
        }

        if (!careerInterests || careerInterests.length === 0) {
            return res.status(400).json({
                message: "At least one career interest is required",
            });
        }

        const profileCompletion = calculateProfileCompletion({
            degree,
            major,
            technicalSkills,
            softSkills,
            careerInterests,
            experienceTags,
            experienceText,
        });

        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            {
                user: req.user._id,
                degree,
                major,
                technicalSkills,
                softSkills,
                careerInterests,
                experienceTags,
                experienceText,
                profileCompletion,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        await User.findByIdAndUpdate(req.user._id, {
            hasCompletedProfile: true,
        });

        return res.status(200).json({
            message: "Profile saved successfully",
            profile,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while saving profile",
            error: error.message,
        });
    }
};

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while loading profile",
            error: error.message,
        });
    }
};