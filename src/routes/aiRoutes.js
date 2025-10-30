import express from 'express';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

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
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

        const prompt = `Extract job details from this image:
    - Job Title
    - Salary
    - Country
    - Key Requirements
    - Description
    Output valid JSON only.`;

        const imagePart = await urlToGenerativePart(imageUrl, 'image/jpeg');
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonData = JSON.parse(cleanedText);

        res.json(jsonData);
    } catch (error) {
        console.error('AI Extraction Error:', error);
        res.status(500).json({ error: 'Failed to extract job data using AI.' });
    }
});

export default router;
