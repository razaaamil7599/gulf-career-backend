// Final restore attempt
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const vacancyRoutes = require('./routes/vacancyRoutes');
const aiRoutes = require('./routes/aiRoutes'); // AI route import

dotenv.config();
const app = express();

// --- CORS KO FINAL UPDATE KIYA GAYA HAI ---
const corsOptions = {
    // NAYA ADMIN PANEL KA URL YAHAN JODA GAYA HAI
    origin: [
        'http://localhost:3000',
        'https://gulfcareergateway.netlify.app',
        'https://gulf-career-admin.netlify.app' // <-- YEH NAYI LINE HAI
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
require('./config/cloudinaryConfig.js');

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
app.use('/api/ai', aiRoutes); // AI route use