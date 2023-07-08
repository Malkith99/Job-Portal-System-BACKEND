const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vacancy: [{
        vacancyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vacancy',
            required: true
        },
        responses: [{
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            responseDate: {
                type: Date,
                default: Date.now
            },
            comment: {
                type: String
            }
        }]
    }]
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
