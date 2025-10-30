// src/routes/aiRoutes.js (FINAL CODE)
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generai');
const router = express.Router();

// Google AI client ko initialize karna
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to convert image URL to Gemini's format
async function urlToGenerativePart(url, mimeType) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return {
        inlineData: {
            data: Buffer.from(buffer).toString("base64"),
            mimeType,
        },
    };
}

// Naya endpoint: POST request ke zariye image URL lena
router.post('/extract-job-data', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt = `From the provided job advertisement image, extract the following details precisely:
        - Job Title (title)
        - Salary (salary)
        - Country (country)
        - Key Requirements (requirements)
        - Brief Description (description)
        
        Provide the output ONLY in a clean JSON format. Do not add any extra text, explanations, or markdown formatting.
        Example:
        {
          "title": "Heavy Duty Driver",
          "salary": "SAR 2000 + OT",
          "country": "Saudi Arabia",
          "requirements": "Must have valid license. 5 years experience.",
          "description": "Looking for an experienced heavy duty driver for a construction company."
        }`;

        const imagePart = await urlToGenerativePart(imageUrl, "image/jpeg");

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // AI se mile text ko saaf karke JSON mein badalna
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonData = JSON.parse(cleanedText);

        res.json(jsonData);

    } catch (error) {
        console.error("AI Data Extraction Error:", error);
        res.status(500).json({ error: "Failed to extract data from image using AI." });
    }
});

module.exports = router;