// Final restore attempt
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// File paths are correct for the 'src' folder structure
const vacancyRoutes = require('./routes/vacancyRoutes');

dotenv.config();

const app = express();

// CORS configuration to allow all your live sites
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://gulfcareergateway.netlify.app',
        'https://gulf-career-admin.netlify.app'
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// --- THIS IS THE CORRECTED PATH ---
// Cloudinary config is now in the same directory level
require('./config/cloudinaryConfig.js');

// --- MongoDB Atlas Connection ---
console.log("Connecting to MongoDB Atlas... Please wait.");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Successfully connected to MongoDB Atlas! Database is ready.");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✅ Server is running successfully on port ${PORT}`);
        });
    }).catch(err => {
        console.error("❌ CONNECTION FAILED! Please check your MONGO_URI in the .env file.");
        console.error("Error Details:", err.message);
        process.exit(1);
    });

// API Routes
const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/settings', settingsRoutes);