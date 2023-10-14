const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vacancyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy',
        required: true
    },
    recommended: {
        type: String,
        enum: ['recommended', 'no_recommend_need', 'not_decided'],
        default: 'not_decided'
    },
    comment: {
        type: String,
        default:null
    },
    approved: {
        type: Boolean,
        default: null // Set to your desired default value
    }
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
