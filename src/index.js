// src/index.js (FINAL CORRECTED CODE for Backend Project)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Raste theek kiye gaye hain
const vacancyRoutes = require('./routes/vacancyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

dotenv.config();
const app = express();

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

// Rasta theek kiya gaya hai
require('./config/cloudinaryConfig.js');

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

app.use('/api/vacancies', vacancyRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);