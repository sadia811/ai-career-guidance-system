import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Career from "../models/Career.js";

dotenv.config();
await connectDB();

const careers = [
    {
        title: "Data Scientist",
        slug: "data-scientist",
        description: "Analyze data, build models, and generate business insights.",
        salaryMin: 90000,
        salaryMax: 140000,
        requiredSkills: ["Python", "Machine Learning", "Statistics"],
        industry: "Data",
        popularityScore: 95,
        isPopular: true,
        source: "seed",
    },
    {
        title: "Cyber Security",
        slug: "cyber-security",
        description: "Protect systems, networks, and digital assets.",
        salaryMin: 80000,
        salaryMax: 120000,
        requiredSkills: ["Networking", "Security", "Cyber Defense"],
        industry: "Security",
        popularityScore: 89,
        isPopular: true,
        source: "seed",
    },
    {
        title: "Software Engineer",
        slug: "software-engineer",
        description: "Design, build, and maintain software systems.",
        salaryMin: 85000,
        salaryMax: 130000,
        requiredSkills: ["JavaScript", "React", "SQL"],
        industry: "Software",
        popularityScore: 91,
        isPopular: true,
        source: "seed",
    }
];

try {
    await Career.deleteMany();
    await Career.insertMany(careers);
    console.log("Career data seeded successfully");
    process.exit();
} catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
}