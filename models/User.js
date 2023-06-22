const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");  // You can use Joi to validate data against the defined schema, ensuring that it meets the specified rules and constraints.
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    profilePhoto: { type: String }, // Store the binary data (Buffer) here
    contactNumber: { type: Number },
    website: { type: String },
    location: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    verified: { type: Boolean, default: false }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {        // This helps to maintain data integrity and provides error handling for invalid data inputs.         
    const schema = Joi.object({
        profilePhoto: Joi.string().label('Profile Photo'), // Use Joi.binary() for binary data
        location: Joi.string().label("Location"),
        website: Joi.string().label("Website"),
        contactNumber: Joi.number().label("Contact Number"),
        firstName: Joi.string().label("First Name"),
        lastName: Joi.string().label("Last Name"),
        email: Joi.string().label("Email"),
        role: Joi.string().label("Role"),
        password: passwordComplexity().label("Password"),
    });
    return schema.validate(data);
};

module.exports = { User, validate };
