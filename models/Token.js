const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    token: {                 // This field represents the token associated with a user for email verification.
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default:Date.now(),
        expires: 3600
    }
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
