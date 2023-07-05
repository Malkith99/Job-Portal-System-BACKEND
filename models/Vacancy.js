const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        flyer: {
            type: String
        },
        jobPosition: {
            type: String
        },
        contactNumber: {
            type: String
        },
        background: {
            type: String
        },
        companyName: {
            type: String
        },
        salary: {
            type: Number,
            default: 1
        },
        levelOfEducation: {
            type: String
        },
        companyEmail: {
            type: String
        },
        companyLocation: {
            type: String
        },
        dueDate: {
            type: Date
        },
        skills: {
            type: [String]
        },
        jobDescription: {
            type: String
        }
    }]
});

const Vacancy = mongoose.model('Vacancy', vacancySchema);

module.exports = Vacancy;
