const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Vacancy = require('../models/Vacancy');

// CREATE a new vacancy
router.post(
    '/',
    [
        // Validation middleware
        body('userId').notEmpty().isString(),
        body('jobPosition').notEmpty().isString(),
        // Add more validation rules for other fields
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userId = req.body.userId;
            const item = {
                jobPosition: req.body.jobPosition,
                flyer: req.body.flyer,
                background: req.body.background,
                companyName: req.body.companyName,
                salary: req.body.salary,
                salaryRangeMax: req.body.salaryRangeMax,
                levelOfEducation: req.body.levelOfEducation,
                companyEmail: req.body.companyEmail,
                companyLocation: req.body.companyLocation,
                dueDate: req.body.dueDate,
                skills: req.body.skills,
                jobDescription: req.body.jobDescription,
            };

            // Create a new vacancy or update existing
            let vacancy = await Vacancy.findOne({ userId: userId });

            if (!vacancy) {
                vacancy = new Vacancy({
                    userId: userId,
                    items: [item],
                });
            } else {
                // Check if the item is already in the vacancy
                console.log(item.dueDate);
            }

            await vacancy.save();
            res.status(201).json(vacancy);
            // ...
        } catch (error) {
            console.error('Failed to save the vacancy:', error);
            res.status(500).json({ message: 'Failed to save the vacancy' });
        }
    }
);



// GET all vacancies
router.get('/', async (req, res) => {
    try {
        const vacancies = await Vacancy.find();
        res.json(vacancies);
    } catch (error) {
        console.error('Failed to fetch vacancies:', error);
        res.status(500).json({ error: 'Failed to fetch vacancies' });
    }
});



// READ a single vacancy
router.get('/vacancies/:id', async (req, res) => {
    try {
        const vacancy = await Vacancy.findById(req.params.id);
        if (vacancy) {
            res.json(vacancy);
        } else {
            res.status(404).json({ error: 'Vacancy not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the vacancy' });
    }
});

// Get cart items for a user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the cart for the user
        const vacancy = await Vacancy.findOne({ userId: userId });

        if (!vacancy) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(vacancy.items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});





// UPDATE a vacancy
router.put('/vacancies/:id', async (req, res) => {
    try {
        const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (vacancy) {
            res.json(vacancy);
        } else {
            res.status(404).json({ error: 'Vacancy not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the vacancy' });
    }
});

// DELETE a vacancy
router.delete('/vacancies/:id', async (req, res) => {
    try {
        const vacancy = await Vacancy.findByIdAndRemove(req.params.id);
        if (vacancy) {
            res.json({ message: 'Vacancy deleted successfully' });
        } else {
            res.status(404).json({ error: 'Vacancy not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the vacancy' });
    }
});

module.exports = router;
