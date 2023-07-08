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


    //sensitive data
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    verified: { type: Boolean, default: false }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id}, "abc-def-ghi", {
        expiresIn: "7d",
    });
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        profilePhoto: Joi.string().label('Profile Photo'), // Use Joi.binary() for binary data
        location: Joi.string().label("Location"),
        website: Joi.string().label("Website"),
        contactNumber: Joi.number().label("Contact Number"),


        firstName: Joi.string().label("First Name"),
        middleName: Joi.string().label("Middle Name"),
        lastName: Joi.string().label("Last Name"),
        indexNumber: Joi.number().label("Index Number"),
        DOB: Joi.string().label("Date of Birth"),
        gender: Joi.string().label("Gender"),


        email: Joi.string().label("Email"),
        role: Joi.string().label("Role"),
        password: passwordComplexity().label("Password"),
    });
    return schema.validate(data);
};

module.exports = { User, validate };
