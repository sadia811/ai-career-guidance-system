import Profile from "../models/Profile.js";
import Career from "../models/Career.js";

const escapeRegex = (value = "") => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const predictMyCareer = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found. Please complete your profile first.",
            });
        }

        const mlResponse = await fetch(`${process.env.ML_API_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                degree: profile.degree,
                major: profile.major,
                technicalSkills: profile.technicalSkills,
                softSkills: profile.softSkills,
                careerInterests: profile.careerInterests,
                experienceTags: profile.experienceTags,
                experienceText: profile.experienceText,
            }),
        });

        const mlData = await mlResponse.json();

        if (!mlResponse.ok) {
            return res.status(500).json({
                message: mlData.message || "ML prediction service failed",
                error: mlData.error || "",
            });
        }

        const topCareerTitle = mlData.topCareer;
        let topCareerDetails = null;
        let missingSkills = [];

        if (topCareerTitle) {
            const matchedCareer = await Career.findOne({
                title: { $regex: `^${escapeRegex(topCareerTitle)}$`, $options: "i" },
            });

            if (matchedCareer) {
                topCareerDetails = {
                    _id: matchedCareer._id,
                    title: matchedCareer.title,
                    slug: matchedCareer.slug,
                    industry: matchedCareer.industry,
                    salaryMin: matchedCareer.salaryMin,
                    salaryMax: matchedCareer.salaryMax,
                    requiredSkills: matchedCareer.requiredSkills,
                };

                const userSkills = new Set(
                    [...(profile.technicalSkills || []), ...(profile.softSkills || [])].map((skill) =>
                        String(skill).toLowerCase()
                    )
                );

                missingSkills = (matchedCareer.requiredSkills || []).filter(
                    (skill) => !userSkills.has(String(skill).toLowerCase())
                );
            }
        }

        return res.status(200).json({
            message: "Career prediction generated successfully",
            topCareer: mlData.topCareer,
            predictions: mlData.predictions,
            topCareerDetails,
            missingSkills,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while generating prediction",
            error: error.message,
        });
    }
};