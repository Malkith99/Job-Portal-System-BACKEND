const express = require('express');
const router = express.Router();
const Recommendation = require('./path/to/recommendationModel'); // Adjust the path accordingly

// GET all recommendations
router.get('/recommendations', async (req, res) => {
    try {
        const recommendations = await Recommendation.find();
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recommendations' });
    }
});

// PUT (update) a recommendation by ID
router.put('/recommendations/:id', async (req, res) => {
    const { recommended, comment, approved } = req.body;
    try {
        const updatedRecommendation = await Recommendation.findByIdAndUpdate(
            req.params.id,
            { recommended, comment, approved },
            { new: true }
        );
        res.json(updatedRecommendation);
    } catch (error) {
        res.status(500).json({ error: 'Error updating recommendation' });
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
