const mongoose = require("mongoose"); // assign mongoose package to const variable

const Schema = mongoose.Schema; //Schema-template of a document mongodb

const companySchema=new Schema({
    companyName: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true, //  email address should be unique (only one should exist)
      },
      password: {
        type: String,
        required: true, //  required-make it required
      },
      companywebsite: {
      type: String, // Number-primitive data type in js
      required:true
       },
      position: {
      type: String, // Number-primitive data type in js
      required:true
      },
      location: {
      type: String, // Number-primitive data type in js
      required:true
      },
      salary: {
      type: String,
      required:true
      },
      jobd: {
      type: String,
      required:true
      },
      other: {
      type: String
      }
});


const Company = mongoose.model("Company", companySchema);  //"Company"-Name of the schema
                                                            //in mongodb this creates as "companies" 

module.exports =Company; 