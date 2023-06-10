const mongoose = require("mongoose"); // assign mongoose package to const variable

const Schema = mongoose.Schema; //Schema- template of a document mongodb

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      //required :true              //  required-make it required
    },
    middleName: {
      type: String,
      //required :true              //  required-make it required
    },
    lastName: {
      type: String,
      //required :true              //  required-make it required
    },
    indexNumber: {
      type: Number,
      //required :true              //  required-make it required
    },
    DOB: {
      type: Date,
      // required :true              //  required-make it required
    },
    DOG: {
      type: Date,
      // required :true              //  required-make it required
    },
    gender: {
      type: String,
      //required:true
    },
    phoneNumber1: {
      type: Number, // Number-primitive data type in js
      //required:true
    },
    phoneNumber2: {
      type: Number, // Number-primitive data type in js
      // required:true
    },
    references: {
      type: String,
      //required:true
    },
    faculty: {
      type: String,
      // required:true
    },
    field: {
      type: String,
      // required:true
    },
    subSpeciality: {
      type: String,
      //required:true
    },
    projects: {
      type: String,
      //required:true
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
    eActivities: {
      type: String,
    },
    profileImage: {
      // image uploading
      data: Buffer,
      contentType: String,
    },

    myApplications: [
      {
        companyName: {
          type: String,
          required: true,
        },
        position: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // tells our databse to automatically save the creation and update timestamp of each entry
  }
);

const Student = mongoose.model("Student", studentSchema); //"Student"-Name of the schema
//in mongodb this creates as "students"
module.exports = Student;
