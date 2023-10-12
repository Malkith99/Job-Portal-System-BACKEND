const mongoose=require('mongoose');

const applicationSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    application:[{}]


});
const Application=mongoose.model('Application',applicationSchema);
module.exports=Application;