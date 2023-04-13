const mongoose=require('mongoose');       // assign mongoose package to const variable

const Schema=mongoose.Schema;           //Schema- template of a document mongodb

const studentSchema=new Schema({
/*     name:{
        type: String,
        required :true              //  required-make it required 
    },
        age:{
        type:Number,                // Number-primitive data type in js
        required:true
    },
    gender:{
        type:String,
        required:true
    } */
   email:{
        type: String,
        required :true,    
        unique :true          //  email address should be unique (only one should exist)
    },
    password:{
        type: String,
        required :true              //  required-make it required 
    }


})

const Student=mongoose.model("Student",studentSchema);   //"Student"-Name of the schema 
                                                        //in mongodb this creates as "students"
module.exports=Student;