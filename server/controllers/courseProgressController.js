import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";

const DEFAULT_TOTAL_SESSIONS = 5;

const buildProgressState = (completedSessions, totalSessions = DEFAULT_TOTAL_SESSIONS) => {
    const safeCompleted = Math.max(0, Math.min(completedSessions, totalSessions));
    const progress = Math.round((safeCompleted / totalSessions) * 100);

    let status = "Not Started";
    if (progress >= 100) {
        status = "Completed";
    } else if (progress > 0) {
        status = "In Progress";
    }

    return {
        completedSessions: safeCompleted,
        totalSessions,
        progress,
        status,
    };
};

export const updateCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { action, progress } = req.body || {};

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        let courseProgress = await CourseProgress.findOne({
            user: req.user._id,
            course: courseId,
        });

        if (!courseProgress) {
            courseProgress = await CourseProgress.create({
                user: req.user._id,
                course: courseId,
                completedSessions: 0,
                totalSessions: DEFAULT_TOTAL_SESSIONS,
                progress: 0,
                status: "Not Started",
            });
        }

        let nextCompletedSessions = courseProgress.completedSessions;
        const totalSessions = courseProgress.totalSessions || DEFAULT_TOTAL_SESSIONS;

        if (action === "complete-session") {
            nextCompletedSessions = Math.min(nextCompletedSessions + 1, totalSessions);
        } else if (action === "mark-completed") {
            nextCompletedSessions = totalSessions;
        } else if (action === "reset") {
            nextCompletedSessions = 0;
        } else if (typeof progress === "number") {
            if (progress >= 100) {
                nextCompletedSessions = totalSessions;
            } else if (progress <= 0) {
                nextCompletedSessions = 0;
            } else {
                nextCompletedSessions = Math.min(nextCompletedSessions + 1, totalSessions);
            }
        } else {
            return res.status(400).json({
                message: "Valid action or progress value is required",
            });
        }

        const computed = buildProgressState(nextCompletedSessions, totalSessions);

        courseProgress.completedSessions = computed.completedSessions;
        courseProgress.totalSessions = computed.totalSessions;
        courseProgress.progress = computed.progress;
        courseProgress.status = computed.status;
        courseProgress.lastOpenedAt = new Date();

        await courseProgress.save();

        return res.status(200).json({
            message:
                action === "mark-completed"
                    ? "Course marked as completed"
                    : action === "reset"
                        ? "Course progress reset"
                        : "Course progress updated successfully",
            progress: courseProgress,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating course progress",
            error: error.message,
        });
    }
};