import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// Register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields",
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists with this email",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                hasCompletedProfile: user.hasCompletedProfile,
                token: generateToken(user._id),
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error during registration",
            error: error.message,
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.status(200).json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    hasCompletedProfile: user.hasCompletedProfile,
                    token: generateToken(user._id),
                },
            });
        }

        res.status(401).json({
            message: "Invalid email or password",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error during login",
            error: error.message,
        });
    }
};

// Forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide your email",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message: "If an account with that email exists, a reset link has been sent.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Reset Your Password</h2>
        <p>You requested a password reset for your Career Guidance account.</p>
        <p>Click the button below to reset your password:</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#4f86e8;color:#fff;text-decoration:none;border-radius:6px;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 15 minutes.</p>
      </div>
    `;

        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            html,
        });

        res.status(200).json({
            message: "If an account with that email exists, a reset link has been sent.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error during forgot password request",
            error: error.message,
        });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Please provide a new password",
            });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
            });
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({
            message: "Password reset successful",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error during forgot password request",
            error: error.message,
        });
    }
};