import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Career from "./models/Career.js";
import Course from "./models/Course.js";
import careers from "./data/careers.js";
import courses from "./data/courses.js";

dotenv.config();
await connectDB();

const importData = async () => {
    try {
        const careerIdMap = {};

        for (const careerData of careers) {
            const career = await Career.findOneAndUpdate(
                { slug: careerData.slug },
                {
                    ...careerData,
                    lastSyncedAt: new Date(),
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

            careerIdMap[careerData.slug] = career._id;
        }

        for (const courseData of courses) {
            const careerId = careerIdMap[courseData.careerSlug];

            if (!careerId) {
                console.log(`Career not found for course: ${courseData.title}`);
                continue;
            }

            await Course.findOneAndUpdate(
                {
                    title: courseData.title,
                    provider: courseData.provider,
                },
                {
                    title: courseData.title,
                    provider: courseData.provider,
                    url: courseData.url,
                    careers: [careerId],
                    skillsCovered: courseData.skillsCovered,
                    difficulty: courseData.difficulty,
                    durationHours: courseData.durationHours,
                    isActive: courseData.isActive,
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );
        }

        console.log("Career and course data imported successfully.");
        process.exit();
    } catch (error) {
        console.error("Seeder error:", error.message);
        process.exit(1);
    }
};

const destroyCoursesOnly = async () => {
    try {
        await Course.deleteMany();
        console.log("All courses deleted.");
        process.exit();
    } catch (error) {
        console.error("Delete error:", error.message);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    destroyCoursesOnly();
} else {
    importData();
}