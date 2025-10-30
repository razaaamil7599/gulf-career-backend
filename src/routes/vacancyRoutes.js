// src/routes/vacancyRoutes.js (ESM Final Version)
import express from 'express';
import Vacancy from '../models/vacancyModel.js';

const router = express.Router();

// GET: Saare vacancies ko lao
router.get('/', async (req, res) => {
    try {
        const vacancies = await Vacancy.find();
        res.json(vacancies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vacancies' });
    }
});

// POST: Nayi vacancy add karo
router.post('/', async (req, res) => {
    try {
        const newVacancy = new Vacancy(req.body);
        const savedVacancy = await newVacancy.save();
        res.status(201).json(savedVacancy);
    } catch (error) {
        res.status(400).json({ message: 'Error adding vacancy' });
    }
});

// PUT: Vacancy update karo
router.put('/:id', async (req, res) => {
    try {
        const updatedVacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedVacancy);
    } catch (error) {
        res.status(400).json({ message: 'Error updating vacancy' });
    }
});

// DELETE: Vacancy delete karo
router.delete('/:id', async (req, res) => {
    try {
        await Vacancy.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vacancy' });
    }
});

export default router;
