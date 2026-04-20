import Career from "../models/Career.js";
import Course from "../models/Course.js";
import Profile from "../models/Profile.js";
import CourseProgress from "../models/CourseProgress.js";

const buildSalaryFilter = (salaryRange) => {
    if (!salaryRange || salaryRange === "All Ranges") return {};

    if (salaryRange === "Under $90k") {
        return { salaryMax: { $lt: 90000 } };
    }

    if (salaryRange === "$90k - $120k") {
        return {
            salaryMin: { $gte: 90000 },
            salaryMax: { $lte: 120000 },
        };
    }

    if (salaryRange === "$120k+") {
        return { salaryMax: { $gte: 120000 } };
    }

    return {};
};

export const getPopularCareers = async (req, res) => {
    try {
        const careers = await Career.find({ isPopular: true })
            .sort({ popularityScore: -1, updatedAt: -1 })
            .limit(4);

        res.status(200).json(careers);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching popular careers",
            error: error.message,
        });
    }
};

export const getAllCareers = async (req, res) => {
    try {
        const { search = "", industry = "", experience = "", salaryRange = "" } = req.query;

        const query = {};

        if (search.trim()) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { industry: { $regex: search, $options: "i" } },
                { requiredSkills: { $elemMatch: { $regex: search, $options: "i" } } },
            ];
        }

        if (industry && industry !== "All Industries") {
            query.industry = industry;
        }

        if (experience && experience !== "All Levels") {
            query.experienceLevel = experience;
        }

        Object.assign(query, buildSalaryFilter(salaryRange));

        const careers = await Career.find(query).sort({
            popularityScore: -1,
            title: 1,
        });

        res.status(200).json(careers);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching careers",
            error: error.message,
        });
    }
};

export const getCareerDetails = async (req, res) => {
    try {
        const { careerId } = req.params;

        const career = await Career.findById(careerId);

        if (!career) {
            return res.status(404).json({
                message: "Career not found",
            });
        }

        res.status(200).json(career);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching career details",
            error: error.message,
        });
    }
};

export const toggleSavedCareer = async (req, res) => {
    try {
        const { careerId } = req.params;

        const career = await Career.findById(careerId);

        if (!career) {
            return res.status(404).json({
                message: "Career not found",
            });
        }

        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            profile = await Profile.create({
                user: req.user._id,
                savedCareers: [],
            });
        }

        const alreadySaved = profile.savedCareers.some(
            (id) => String(id) === String(careerId)
        );

        if (alreadySaved) {
            profile.savedCareers = profile.savedCareers.filter(
                (id) => String(id) !== String(careerId)
            );
        } else {
            profile.savedCareers.push(careerId);
        }

        await profile.save();

        res.status(200).json({
            message: alreadySaved
                ? "Career removed from saved careers"
                : "Career saved successfully",
            savedCareerIds: profile.savedCareers,
            isSaved: !alreadySaved,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while saving career",
            error: error.message,
        });
    }
};

export const getMySavedCareers = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).populate("savedCareers");

        if (!profile) {
            return res.status(200).json([]);
        }

        res.status(200).json(profile.savedCareers || []);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching saved careers",
            error: error.message,
        });
    }
};

export const setCareerGoal = async (req, res) => {
    try {
        const { careerId } = req.params;

        const career = await Career.findById(careerId);

        if (!career) {
            return res.status(404).json({
                message: "Career not found",
            });
        }

        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            profile = await Profile.create({
                user: req.user._id,
            });
        }

        profile.careerGoal = careerId;
        await profile.save();

        res.status(200).json({
            message: `${career.title} set as career goal`,
            careerGoal: career,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while setting career goal",
            error: error.message,
        });
    }
};

export const getCareerCourses = async (req, res) => {
    try {
        const { careerId } = req.params;

        const courses = await Course.find({
            careers: careerId,
            isActive: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        const courseIds = courses.map((course) => course._id);

        const progressDocs = await CourseProgress.find({
            user: req.user._id,
            course: { $in: courseIds },
        }).lean();

        const progressMap = new Map(
            progressDocs.map((item) => [String(item.course), item])
        );

        const mergedCourses = courses.map((course) => {
            const progress = progressMap.get(String(course._id));

            return {
                _id: course._id,
                title: course.title,
                provider: course.provider,
                url: course.url,
                description: course.description,
                skillsCovered: course.skillsCovered,
                difficulty: course.difficulty,
                durationHours: course.durationHours,
                completedSessions: progress?.completedSessions || 0,
                totalSessions: progress?.totalSessions || 5,
                progress: progress?.progress || 0,
                status: progress?.status || "Not Started",
            };
        });

        return res.status(200).json(mergedCourses);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while fetching courses",
            error: error.message,
        });
    }
};