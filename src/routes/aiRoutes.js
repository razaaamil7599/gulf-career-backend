// src/routes/aiRoutes.js
import express from 'express';
const router = express.Router();

// Basic route to check if it's working
router.get('/', (req, res) => {
    res.send('AI routes are working');
});

export default router;
