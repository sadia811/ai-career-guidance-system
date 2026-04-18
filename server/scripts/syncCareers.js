import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { syncCareersFromInternet } from "../services/careerSyncService.js";

dotenv.config();

const run = async () => {
    try {
        await connectDB();
        const careers = await syncCareersFromInternet();

        console.log(`Career sync completed. Saved ${careers.length} careers.`);
        process.exit(0);
    } catch (error) {
        console.error("Career sync script failed:", error.message);
        process.exit(1);
    }
};

run();