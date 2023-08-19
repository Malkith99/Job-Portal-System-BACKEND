const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    profilePhoto: { type: String }, // Store the binary data (Buffer) here
    contactNumber: { type: Number },
    website: { type: String },
    location: { type: String },

    //user student information
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    indexNumber:{type: Number},
    DOB:{type: String},
    gender:{type: String},
    refree:{type: String},
    recomondation:{type: String},

    //lecturer middlewear
    recomondation: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        vacancyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vacancy',
            required: true
        }
    }],

    


    //sensitive data
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    verified: { type: Boolean, default: false },
    signupDate: {type: Date,default: Date.now }
});

userSchema.methods.generateAuthToken = function () {

    return jwt.sign({_id: this._id}, "abc-def-ghi", {
        expiresIn: "7d",
    });
};

const User = mongoose.model("User", userSchema);

//this is the validation function for the user this is constant dont change it
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().label("First Name"),
        middleName: Joi.string().label("Middle Name"),
        lastName: Joi.string().label("Last Name"),
        email: Joi.string().label("Email"),
        role: Joi.string().label("Role"),
        password: passwordComplexity().label("Password"),
    });
    return schema.validate(data);
};

module.exports = { User, validate };
