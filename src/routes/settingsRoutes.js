// src/routes/settingsRoutes.js (ESM Final Version)
import express from 'express';
import Settings from '../models/settingsModel.js';

const router = express.Router();

// GET: Contact settings ko database se nikalo
router.get('/', async (req, res) => {
    try {
        // Sirf 'contactInfo' wala document dhoondho
        const settings = await Settings.findOne({ key: 'contactInfo' });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

// PUT: Contact settings ko database mein update karo
router.put('/', async (req, res) => {
    try {
        const { email, whatsapp, address } = req.body;

        const updatedSettings = await Settings.findOneAndUpdate(
            { key: 'contactInfo' },
            { email, whatsapp, address },
            { new: true, upsert: true } // naya document bana de agar nahi milta
        );

        res.json(updatedSettings);
    } catch (error) {
        res.status(400).json({ message: 'Error updating settings' });
    }
});

export default router;
