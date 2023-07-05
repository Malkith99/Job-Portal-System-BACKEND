const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
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
        console.log(userId);
        let user = await User.findById(userId);


        console.log(user.email);
        if (!user) {
            console.log("Invalid user ID: " + userId);
            return res.status(400).send({ message: "Invalid user ID" });
        }

        // Update user fields
        if(req.body.profilePhoto) {user.profilePhoto = req.body.profilePhoto;}
        if(req.body.firstName) {user.firstName = req.body.firstName;}
        if(req.body.middleName) {user.middleName = req.body.middleName;}
        if(req.body.lastName) {user.lastName = req.body.lastName;}
        if(req.body.indexNumber) {user.indexNumber = req.body.indexNumber;}
        if(req.body.DOB) {user.DOB = req.body.DOB;}
        if(req.body.gender) {user.gender = req.body.gender;}


        //company user updates
        if(req.body.contactNumber) {user.contactNumber = req.body.contactNumber;}
        if(req.body.website) {user.website = req.body.website;}
        if(req.body.location) {user.location = req.body.location;}

        // Save the updated user
        await user.save();

        console.log("User StudentProfile updated successfully");
        res.status(200).send({ message: "User StudentProfile updated successfully" });
    } catch (error) {
        console.error(`Error updating user profile: ${error.message}`);
        console.log("Error updating");
        res.status(500).send({ message: "Internal Server Error: Update User Profile" });
    }
});




//get specific user
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




// get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();

        if (!users) {
            console.log("No users found");
            return res.status(404).send({ message: "No users found" });
        }

        console.log("Users data retrieved");
        res.status(200).send({ users });
    } catch (error) {
        console.error(`Error retrieving users data: ${error.message}`);
        res.status(500).send({ message: "Internal Server Error: Retrieve Users Data" });
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
        await Token.deleteOne({_id: token._id})

        console.log(`User ${user._id} has been verified`);
        res.status(200).send({message:"Account Verified"})
    } catch(error){
        console.error(`Error verifying user: ${error.message}`);
        res.status(500).send({ message: "Internal Server Error: Verification" });
    }
});


module.exports = router;