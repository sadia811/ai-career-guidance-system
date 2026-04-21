import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import userSettingsRoutes from "./routes/userSettingsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import AdminDashboardPage from "./pages/AdminDashboardPage";

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            const isAllowed =
                allowedOrigins.includes(origin) ||
                /\.vercel\.app$/.test(new URL(origin).hostname);

            if (isAllowed) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/users", userSettingsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});