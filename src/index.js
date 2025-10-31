// src/index.js — FINAL CORS FIXED VERSION (Vercel Ready)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import vacancyRoutes from "./routes/vacancyRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();
const app = express();

// ✅ Step 1: Allow frontend origins explicitly
const allowedOrigins = [
    "http://localhost:3000",
    "https://gulfcareergateway.netlify.app",
    "https://gulf-career-admin.netlify.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed for this origin"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// ✅ Step 2: Handle OPTIONS preflight manually (important for Netlify)
app.options("*", cors());

// ✅ Step 3: Basic Middleware
app.use(express.json());

// ✅ Step 4: Connect Cloudinary Config (if any)
import "./config/cloudinaryConfig.js";

console.log("Connecting to MongoDB Atlas...");

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully!");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () =>
            console.log(`✅ Server running on port ${PORT}`)
        );
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

// ✅ Step 5: API Routes
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Step 6: Default route
app.get("/", (req, res) => {
    res.send("Backend is running successfully ✅");
});
