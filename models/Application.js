const mongoose=require('mongoose');

const applicationSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items:[{
        companyId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        vacancyId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vacancy',
            required: true
        },
        responseDate:{
            type: Date,
            default: Date.now  
        }
    }]
});
const Application=mongoose.model('Application',applicationSchema);
module.exports=Application;