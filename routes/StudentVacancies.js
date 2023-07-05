const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Vacancy = require('../models/Vacancy');

router.get('/:vacancyId', async (req, res) => {
    try {
        const vacancy = await Vacancy.findOne(
            {
                'items._id': req.params.vacancyId
            },
            { 'items.$': 1, userId: 1 }
        );
        if (vacancy) {
            res.json({ vacancy: vacancy.items[0], userId: vacancy.userId });
            console.log('Data returned to student profile');
        } else {
            res.status(404).json({ error: 'Vacancy not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the vacancy' });
    }
});

module.exports = router;
