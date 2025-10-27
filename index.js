const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const vacancyRoutes = require('./routes/vacancyRoutes');
dotenv.config();
const app = express();

// --- NAYA CORS CODE YAHAN DAALEIN ---
const corsOptions = {
    // Abhi ke liye hum sirf localhost rakhenge.
    // Jab Netlify par site live hogi, to hum uska URL yahan jodenge.
    origin: ['http://localhost:3000', 'https://placeholder-for-your-site.netlify.app'],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));
// --- NAYA CORS CODE KHATAM ---

app.use(express.json());

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

const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/settings', settingsRoutes);