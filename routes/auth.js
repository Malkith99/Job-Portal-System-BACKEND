const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        if(!user.verified){
            let token = await Token.findOne({userId:user._id});
            if(!token){
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save();


                const url = `${process.env.BASE_URL}users/${user._id}/verify/${token}`;
                console.log(url);
                await sendEmail(user.email,url);
            }
            return res.status(400).send({message: "An Email Send to your Account Please Verify"})
        }

        const token = user.generateAuthToken();
        console.log(`User ${user._id} has been login via authentication `);
        console.log(`User Token created `);
        res.status(200).send({ message: `logged in successfully ${user.firstName}`, token: token, user: user});




    } catch (error) {
        res.status(500).send({ message: "Internal Server Error login" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};




module.exports = router;

