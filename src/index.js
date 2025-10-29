// Final restore attempt // Final force update comment
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Yeh vacancyRoutes ka sahi path hai
const vacancyRoutes = require('./routes/vacancyRoutes');

// .env file se secret jaankari load karo
dotenv.config();

const app = express();

// CORS ko FINAL UPDATE KIYA GAYA HAI (Admin Panel ke URL ke saath)
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://gulfcareergateway.netlify.app',
        'https://gulf-career-admin.netlify.app' // Admin panel ka URL
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// --- YAHAN RASTA (PATH) THEEK KIYA GAYA HAI ---
// Cloudinary config ko import karna
require('./config/cloudinaryConfig.js'); // '../' ko './' se badla gaya

// --- MongoDB Atlas se Connect karna ---
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

// API Routes ko server se jodna
const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/settings', settingsRoutes);