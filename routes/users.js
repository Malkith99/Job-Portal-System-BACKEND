const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
const Token = require("../models/Token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user = await new User({ ...req.body, password: hashPassword }).save();

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();

        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        console.log(url);
        await sendEmail(user.email,url);

        res.status(201).send({ message: "An email has been sent to your account. Please verify your email address." });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error: Email Log" });
    }
});


router.put("/", async (req, res) => {
    try {
        const userId = req.body.userId;
        if (userId ) {
            console.log('1');
        }
        else{console.log('0')}

        let user = await User.findOne({ userId: userId }); // Assuming the unique identifier field is "_id"
        console.log(`user: ${user.firstName}`);
        if (!user) {
            console.log("Invalid user ID: " + userId);
            return res.status(400).send({ message: "Invalid user ID" });
        } else {
            console.log("User already exists");

            // Update user fields

            user.contactNumber = req.body.contactNumber;
            user.profilePhoto = req.body.profilePhoto;
            user.website = req.body.website;
            user.location = req.body.location;
            console.log(`website: ${user.location}`);

        }

        // Add more fields as needed

        // Save the updated user
        await user.save();

        console.log("User profile updated successfully");
        res.status(200).send({ message: "User profile updated successfully" });
    } catch (error) {
        console.error(`Error updating user profile: ${error.message}`);
        console.log("Error updating");
        res.status(500).send({ message: "Internal Server Error: Update User Profile" });
    }
});



router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            console.log("Invalid user ID");
            return res.status(404).send({ message: "User not found" });
        }

        console.log(`User data retrieved to profile`);
        res.status(200).send({ user });
    } catch (error) {
        console.error(`Error retrieving user data: ${error.message}`);
        res.status(500).send({ message: "Internal Server Error: Retrieve User Data" });
    }
});





router.get("/:id/verify/:token", async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) {
            console.log("Invalid user ID");
            return res.status(400).send({message:"Invalid Link"});
        }
        const token = await Token.findOne({userId:user._id,token:req.params.token});
        if(!token) {
            console.log("Invalid token");
            return res.status(400).send({message:"Invalid Link"});
        }
        await User.updateOne({_id:user._id},{$set:{verified:true}});
        await Token.deleteOne({_id: token._id})  //token._id  referring to the unique identifier of a Token document in MongoDB 
       // It prevents the same token from being used multiple times for verification. Once the token is used and the associated
       // user is verified, it should no longer be valid.

        console.log(`User ${user._id} has been verified`);
        res.status(200).send({message:"Account Verified"})
    } catch(error){
        console.error(`Error verifying user: ${error.message}`);
        res.status(500).send({ message: "Internal Server Error: Verification" });
    }
});


module.exports = router;