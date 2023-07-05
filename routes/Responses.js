const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Vacancy = require("../models/Vacancy");



// POST request to save a new response
router.post('/', async (req, res) => {
    try {
        const newResponse = req.body;
        const companyId = newResponse.companyId;
        const vacancyId = newResponse.vacancyId;
        const studentId = newResponse.studentId;

        // Check if the student has already applied for the specified vacancy
        const existingResponse = await Response.findOne({
            companyId: companyId,
            'vacancy.vacancyId': vacancyId,
            'vacancy.responses.studentId': studentId
        });

        if (existingResponse) {
            // If the response already exists, send an error message
            return res.status(400).json({ error: 'Student has already applied for this vacancy' });
        }

        // Find the response with the specified companyId
        let updatedResponses = await Response.findOneAndUpdate(
            {
                companyId: companyId
            },
            {
                $push: {
                    'vacancy': {
                        vacancyId: vacancyId,
                        responses: [
                            {
                                studentId: studentId,
                                responseDate: newResponse.responseDate,
                                comment: newResponse.comment
                            }
                        ]
                    }
                }
            },
            { new: true }
        );

        if (!updatedResponses) {
            // If the response doesn't exist, create a new one
            const response = new Response({
                companyId: companyId,
                vacancy: [
                    {
                        vacancyId: vacancyId,
                        responses: [
                            {
                                studentId: studentId,
                                responseDate: newResponse.responseDate,
                                comment: newResponse.comment
                            }
                        ]
                    }
                ]
            });

            // Save the new response to the database
            updatedResponses = await response.save();
        }

        res.json(updatedResponses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save response' });
    }
});




// Get all responses
router.get('/', async (req, res) => {
    try {
        const responses = await Response.find();
        res.json(responses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific response by ID
router.get('/:companyId', async (req, res) => {
    try {
        const responses = await Response.find({ companyId: req.params.companyId });
        if (responses.length === 0) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json(responses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Update a response by ID
router.patch('/:id', async (req, res) => {
    try {
        const response = await Response.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a response by ID
router.delete('/:id', async (req, res) => {
    try {
        const response = await Response.findByIdAndDelete(req.params.id);
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json({ message: 'Response deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
