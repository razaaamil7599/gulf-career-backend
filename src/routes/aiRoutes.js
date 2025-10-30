// src/routes/aiRoutes.js (FINAL FIXED VERSION)
const express = require('express');
const fetch = require('node-fetch'); // Required for image download
const { GoogleGenerativeAI } = require('@google/generative-ai'); // ✅ missing parenthesis fixed
const router = express.Router();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Convert image URL to base64 for Gemini input
async function urlToGenerativePart(url, mimeType) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return {
        inlineData: {
            data: Buffer.from(buffer).toString('base64'),
            mimeType,
        },
    };
}

// API endpoint for AI-based job data extraction
router.post('/extract-job-data', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // ✅ updated to current stable model

        const prompt = `From the provided job advertisement image, extract the following details in JSON:
        {
          "title": "Job Title",
          "salary": "Salary",
          "country": "Country",
          "requirements": "Key Requirements",
          "description": "Brief Description"
        }`;

        const imagePart = await urlToGenerativePart(imageUrl, 'image/jpeg');
        const result = await model.generateContent([prompt, imagePart]);

        const response = await result.response;
        const text = response.text();

        // Clean and parse AI output
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonData = JSON.parse(cleanedText);

        res.json(jsonData);
    } catch (error) {
        console.error('AI Data Extraction Error:', error);
        res.status(500).json({
            error: 'Failed to extract data from image using AI.',
            details: error.message,
        });
    }
});

module.exports = router;