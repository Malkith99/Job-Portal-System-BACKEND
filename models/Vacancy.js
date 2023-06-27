const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    userId: {          
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',        // line indicates that the user field in the vacancySchema is referencing the "User" model. 
        //This means that the User field will store the _id of a document from the "User" collection.
        required: true 
    },
    items: [            //an array of objects representing individual job vacancies
        {
            flyer: {
                type: String,
                required: true
            },
            jobPosition: {
                type: String,
                required: true
            },
            background: {
                type: String,
                required: true
            },
            companyName: {
                type: String,
                required: true
            },
            salary: {
                type: Number,
                default: 1
            },
            dueDate: {
                type: Date,
                required: true
            },
            skills: {
                type: [String],
                required: true
            },
            description: {
                type: String
            }
        }
    ]
});

const Vacancy = mongoose.model('Vacancy', vacancySchema);

module.exports = Vacancy;
