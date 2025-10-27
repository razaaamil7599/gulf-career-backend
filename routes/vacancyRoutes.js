// routes/vacancyRoutes.js

// --- GET ALL VACANCIES (Updated for Search and Filter) ---
router.get('/', async (req, res) => {
    try {
        // Build the query object based on URL parameters
        const query = {};
        if (req.query.search) {
            // Search in title, description, or country (case-insensitive)
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                // { country: { $regex: req.query.search, $options: 'i' } } // Optional: search by country too
            ];
        }
        if (req.query.country) {
            query.country = { $regex: req.query.country, $options: 'i' }; // Case-insensitive filter
        }
        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: 'i' }; // Case-insensitive filter
        }

        // Find vacancies matching the query, sorted by newest first
        const vacancies = await Vacancy.find(query).sort({ createdAt: -1 });
        res.json(vacancies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vacancies' });
    }
});

// --- CREATE A NEW VACANCY (No change here) ---
// router.post('/', upload.single('image'), ... ); // Keep this part as it is

// --- UPDATE A VACANCY (No change here) ---
// router.put('/:id', ... ); // Keep this part as it is

// --- DELETE A VACANCY (No change here) ---
// router.delete('/:id', ... ); // Keep this part as it is

// module.exports = router; // Keep this line at the end