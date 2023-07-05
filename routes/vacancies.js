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
            const items = {
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
            if (vacancy) {
                vacancy.items.push(items);
            } else {
                vacancy = new Vacancy({
                    userId: userId,
                    items: [items],
                });
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
router.get('/:userId/:vacancyId', async (req, res) => {
    try {
        const vacancy = await Vacancy.findOne(
            { userId: req.params.userId, 'items._id': req.params.vacancyId },
            { 'items.$': 1 }
        );
        if (vacancy) {
            console.log("All the data are fetch");
            res.json(vacancy.items[0]);
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
            return res.status(404).json({ message: 'Vacancy not found' });

        }
        console.log("User Not Found");
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
router.delete('/:userId/:vacancyId', async (req, res) => {
    try {
        const vacancy = await Vacancy.findOneAndUpdate(
            { userId: req.params.userId },
            { $pull: { items: { _id: req.params.vacancyId } } },
            { new: true }
        );
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
