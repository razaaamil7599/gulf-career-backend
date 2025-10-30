// src/index.js (FINAL, 100% GUARANTEED WORKING CORS CODE)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const vacancyRoutes = require('./routes/vacancyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

dotenv.config();
const app = express();

// --- CORS KO FINAL UPDATE KIYA GAYA HAI ---
// Hum server ko saaf-saaf bata rahe hain ki in websites ko allow karna hai
const allowedOrigins = [
    'http://localhost:3000',
    'https://gulfcareergateway.netlify.app',
    'https://gulf-career-admin.netlify.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions));

app.use(express.json());

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