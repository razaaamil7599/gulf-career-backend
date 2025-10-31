// src/routes/vacancyRoutes.js
import express from 'express';
import Vacancy from '../models/Vacancy.js'; // Humne naya Vacancy model import kiya

const router = express.Router();

// --- YEH ROUTE JOBS KO FETCH (GET) KAREGA ---
// Yeh route ab database se saari vacancies laayega
router.get('/', async (req, res) => {
    try {
        // Model ka istemaal karke database se saari jobs dhoondho
        const vacancies = await Vacancy.find({});

        if (vacancies.length === 0) {
            // Agar koi job nahi hai, toh yeh message bhejo
            return res.json({ message: "Database se connect ho gaya, lekin koi job nahi mili." });
        }

        // Saari vacancies ko JSON format mein bhej do
        res.json(vacancies);

    } catch (error) {
        console.error("Database se vacancies fetch karne mein error:", error);
        res.status(500).json({ message: "Server par kuch error aa gaya" });
    }
});

// --- YEH ROUTE NAYI JOB ADD (POST) KAREGA ---
router.post('/', async (req, res) => {
    try {
        // Nayi job ka data request body se aayega (jaise title, description)
        const { title, description, company } = req.body;

        // Check karein ki title hai ya nahi
        if (!title) {
            return res.status(400).json({ message: "Job title zaroori hai" });
        }

        // Nayi job banayein
        const newVacancy = new Vacancy({
            title,
            description,
            company
        });

        // Nayi job ko database mein save karein
        const savedVacancy = await newVacancy.save();

        // Success ka message bhej dein
        res.status(201).json({ message: "Nayi job safaltapoorvak add ho gayi", data: savedVacancy });

    } catch (error) {
        console.error("Nayi job add karne mein error:", error);
        res.status(500).json({ message: "Server par kuch error aa gaya" });
    }
});


export default router;

