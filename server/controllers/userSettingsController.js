import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import RoadmapProgress from "../models/RoadmapProgress.js";
import CourseProgress from "../models/CourseProgress.js";

export const getMyAccountSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select(
            "_id name email hasCompletedProfile createdAt"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while loading account settings",
            error: error.message,
        });
    }
};

export const updateMyAccountSettings = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (name?.trim()) {
            user.name = name.trim();
        }

        if (email?.trim()) {
            const normalizedEmail = email.trim().toLowerCase();

            const existingUser = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: req.user._id },
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email is already in use",
                });
            }

            user.email = normalizedEmail;
        }

        if (password?.trim()) {
            if (password.trim().length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters long",
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password.trim(), salt);
        }

        await user.save();

        return res.status(200).json({
            message: "Account settings updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                hasCompletedProfile: user.hasCompletedProfile,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating account settings",
            error: error.message,
        });
    }
};

export const deleteMyAccount = async (req, res) => {
    try {
        await Profile.deleteOne({ user: req.user._id });
        await RoadmapProgress.deleteMany({ user: req.user._id });
        await CourseProgress.deleteMany({ user: req.user._id });
        await User.findByIdAndDelete(req.user._id);

        return res.status(200).json({
            message: "Account deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while deleting account",
            error: error.message,
        });
    }
};