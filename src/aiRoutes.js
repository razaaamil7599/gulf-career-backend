const express = require('express');
const { GoogleGenAI, Type } = require('@google/genai');
const router = express.Router();
const dotenv = require('dotenv');
const fetch = require('node-fetch'); // fetch ke liye (Node.js me by default nahi hota)

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- POST Route: Extract Job Data from Image ---
router.post('/extract-job-data', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required in the request body." });
    }

    const systemInstruction = `
        Aap ek expert data extractor hain. Aapko di gayi job advertisement image se sirf zaroori details nikaalni hai.
        Fields aur unke formats ka sakhti se paalan karein:
        - title: Job ka naam (e.g., "Cleaner", "Electrician")
        - company: Company ka naam (agar milta hai)
        - country: Job ka location country (e.g., UAE, Qatar, Kuwait)
        - salary: Salary range ya figure
        - requirements: Har requirement ko "|" se separate karke likhein
        - description: Job ki brief summary
        Sirf JSON format mein data dein.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            country: { type: Type.STRING },
            salary: { type: Type.STRING },
            requirements: { type: Type.STRING },
            description: { type: Type.STRING },
        },
        required: ["title", "country", "requirements", "description"],
    };

    try {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: Buffer.from(imageBuffer).toString('base64'),
            },
        };

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [imagePart, { text: "Extract all job data from this image" }],
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema
            }
        });

        const jsonResponseText = result.text.trim();
        const extractedData = JSON.parse(jsonResponseText);
        res.json(extractedData);

    } catch (error) {
        console.error("AI Data Extraction Error:", error);
        res.status(500).json({ error: "Failed to extract data from image using AI.", details: error.message });
    }
});

module.exports = router;
