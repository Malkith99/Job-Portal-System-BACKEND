const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recomondation'); // Adjust the path accordingly


// POST a recommendation or update if a recommendation for the same vacancy ID exists
router.post('/', async (req, res) => {
    const { companyId, lecturerId, studentId, vacancyId, approved, comment } = req.body;

    try {
        // Check if a recommendation for the same student and vacancy ID exists
        const existingRecommendation = await Recommendation.findOne({
            studentId,
            vacancyId
        });

        if (existingRecommendation) {
            // Check if the provided 'approved' value is different from the existing recommendation
            if ((approved !== undefined && existingRecommendation.approved !== approved) || comment !== undefined) {
                existingRecommendation.approved = approved !== undefined ? approved : existingRecommendation.approved;

                // Update the comment only if a new comment is provided
                if (comment !== undefined) {
                    existingRecommendation.comment = comment;
                }

                const updatedRecommendation = await existingRecommendation.save();
                return res.json(updatedRecommendation);
            }
            return res.status(400).json({ error: 'You have already submitted a referee Request.' });
        }

        // Create a new recommendation
        const newRecommendation = new Recommendation({
            companyId,
            lecturerId,
            studentId,
            vacancyId,
            approved: approved || null,
            comment: comment || null
        });

        const savedRecommendation = await newRecommendation.save();
        res.json(savedRecommendation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating recommendation' });
    }
});



// GET all recommendations
router.get('/', async (req, res) => {
    try {
        const recommendations = await Recommendation.find();
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recommendations' });
    }
});




// GET all recommendations
router.get('/recommendations', async (req, res) => {
    try {
        const recommendations = await Recommendation.find();
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recommendations' });
    }
});


// DELETE a recommendation by ID
router.delete('/recommendations/:id', async (req, res) => {
    try {
        await Recommendation.findByIdAndRemove(req.params.id);
        res.json({ message: 'Recommendation deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting recommendation' });
    }
});

module.exports = router;
