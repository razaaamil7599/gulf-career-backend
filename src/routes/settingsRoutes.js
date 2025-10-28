const express = require('express');
const router = express.Router();
const Settings = require('../models/settingsModel');

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
            // new: true, taaki update kiya hua data wapas mile
            // upsert: true, taaki agar data na ho to naya bana de
            { new: true, upsert: true }
        );
        res.json(updatedSettings);
    } catch (error) {
        res.status(400).json({ message: 'Error updating settings' });
    }
});

module.exports = router;