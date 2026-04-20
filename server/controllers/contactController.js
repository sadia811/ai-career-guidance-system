import ContactMessage from "../models/ContactMessage.js";

export const submitContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({
                message: "Name, email, and message are required",
            });
        }

        const contactMessage = await ContactMessage.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject?.trim() || "",
            message: message.trim(),
            user: req.user?._id || null,
        });

        return res.status(201).json({
            message: "Message sent successfully",
            contactMessage,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while sending message",
            error: error.message,
        });
    }
};

export const getAllContactMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email");

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while fetching contact messages",
            error: error.message,
        });
    }
};

export const markContactMessageRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await ContactMessage.findById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        message.status = "Read";
        await message.save();

        return res.status(200).json({
            message: "Message marked as read",
            contactMessage: message,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating message status",
            error: error.message,
        });
    }
};

export const deleteContactMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await ContactMessage.findById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        await ContactMessage.findByIdAndDelete(messageId);

        return res.status(200).json({
            message: "Message deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while deleting message",
            error: error.message,
        });
    }
};