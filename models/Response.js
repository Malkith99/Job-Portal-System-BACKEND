const { boolean } = require('joi');
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
            recomonded: {
                type: String,
                enum: ['recommended', 'no_recommend_need', 'not_decided'],
                default: 'not_decided'
            },
            comment: {
                type: String
            },
            approved: {
                type: Boolean,
                default: null // Set to your desired default value
            }
        }]
    }]
});



// Add pre-removal middleware to delete associated responses
responseSchema.pre('findOneAndRemove', async function (next) {
    try {
        const vacancy = this._conditions.vacancyId; // Access the vacancyId being deleted
        if (vacancy) {
            // Find and delete all responses associated with the vacancy
            await this.model('Response').deleteMany({ 'vacancy.vacancyId': vacancy });
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Add pre-removal middleware to delete associated company from Response model
responseSchema.pre('findOneAndRemove', async function (next) {
    try {
        const userId = this._conditions._id; // Access the userId being deleted
        if (userId) {
            // Find and delete all companies associated with the user from the Response model
            await this.model('Response').updateMany(
                { 'companyId': userId },
                { $pull: { 'vacancy': { 'companyId': userId } } }
            );
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
