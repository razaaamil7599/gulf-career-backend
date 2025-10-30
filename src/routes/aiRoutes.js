const express = require('express');
const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

router.post('/extract-job-data', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
