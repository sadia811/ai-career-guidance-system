import Course from "../models/Course.js";
import UserCourseProgress from "../models/UserCourseProgress.js";

export const updateCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { progress } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        if (typeof progress !== "number" || progress < 0 || progress > 100) {
            return res.status(400).json({
                message: "Progress must be a number between 0 and 100",
            });
        }

        let record = await UserCourseProgress.findOne({
            user: req.user._id,
            course: courseId,
        });

        if (!record) {
            record = new UserCourseProgress({
                user: req.user._id,
                course: courseId,
            });
        }

        record.progress = progress;

        if (progress <= 0) {
            record.status = "not-started";
            record.startedAt = null;
            record.completedAt = null;
        } else if (progress < 100) {
            record.status = "in-progress";
            if (!record.startedAt) {
                record.startedAt = new Date();
            }
            record.completedAt = null;
        } else {
            record.status = "completed";
            if (!record.startedAt) {
                record.startedAt = new Date();
            }
            record.completedAt = new Date();
        }

        await record.save();

        res.status(200).json({
            message: "Course progress updated successfully",
            progress: record,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while updating course progress",
            error: error.message,
        });
    }
};