// api/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import your routes
import vacancyRoutes from "../src/routes/vacancyRoutes.js";
import aiRoutes from "../src/routes/aiRoutes.js";
import settingsRoutes from "../src/routes/settingsRoutes.js";
import "../src/config/cloudinaryConfig.js";

dotenv.config();
const app = express();

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
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.options("*", cors());
app.use(express.json());

let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing DB connection");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log("✅ New MongoDB Connection Successful");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
    }
};

app.use("/api/vacancies", vacancyRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("✅ Backend is running.");
});

export default async (req, res) => {
    await connectDB();
    return app(req, res);
};

// --- YEH CODE SIRF LOCAL DEVELOPMENT KE LIYE HAI ---
// (Vercel is code ko ignore kar dega)

// Hum check kar rahe hain ki code Vercel par nahi chal raha hai
if (process.env.NODE_ENV !== 'production') {

    const PORT = process.env.PORT || 5001; // Port 5001 set karein

    // Server ko start karein
    app.listen(PORT, () => {
        connectDB(); // Database se connect karein
        console.log(`✅ Server http://localhost:${PORT} par locally chal raha hai...`);
    });
}