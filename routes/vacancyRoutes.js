const express = require('express');
const router = express.Router();
const Vacancy = require('../models/vacancyModel');

// --- YAHAN BADLAAV KIYA GAYA HAI ---
// File ka poora naam (.js ke saath) likha hai taaki server par koi confusion na ho
const { upload } = require('../config/cloudinaryConfig.js');

// --- GET ALL VACANCIES ---
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
            ];
        }
        if (req.query.country) {
            query.country = { $regex: req.query.country, $options: 'i' };
        }
        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: 'i' };
        }
        const vacancies = await Vacancy.find(query).sort({ createdAt: -1 });
        res.json(vacancies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vacancies' });
    }
});

// --- GET A SINGLE VACANCY BY ID ---
router.get('/:id', async (req, res) => {
    try {
        const vacancy = await Vacancy.findById(req.params.id);
        if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json(vacancy);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching single vacancy' });
    }
});

// --- CREATE A NEW VACANCY ---
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const newVacancy = new Vacancy({
            title: req.body.title,
            description: req.body.description,
            country: req.body.country,
            category: req.body.category,
            requirements: req.body.requirements,
            salary: req.body.salary,
            contactNumber: req.body.contactNumber,
            imageUrl: req.file ? req.file.path : null,
        });
        const savedVacancy = await newVacancy.save();
        res.status(201).json(savedVacancy);
    } catch (error) {
        res.status(400).json({ message: 'Error creating vacancy', error: error.message });
    }
});

// --- UPDATE A VACANCY ---
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }
        const updatedVacancy = await Vacancy.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedVacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json(updatedVacancy);
    } catch (error) {
        res.status(400).json({ message: 'Error updating vacancy', error: error.message });
    }
});

// --- DELETE A VACANCY ---
router.delete('/:id', async (req, res) => {
    try {
        const deletedVacancy = await Vacancy.findByIdAndDelete(req.params.id);
        if (!deletedVacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vacancy' });
    }
});

module.exports = router;