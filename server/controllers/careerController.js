import Career from "../models/Career.js";

// GET /api/careers/popular
export const getPopularCareers = async (req, res) => {
    try {
        const careers = await Career.find({ isPopular: true })
            .sort({ popularityScore: -1, updatedAt: -1 })
            .limit(3);

        res.status(200).json(careers);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching popular careers",
            error: error.message,
        });
    }
};

// GET /api/careers
export const getAllCareers = async (req, res) => {
    try {
        const careers = await Career.find().sort({ popularityScore: -1, title: 1 });

        res.status(200).json(careers);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching careers",
            error: error.message,
        });
    }
};