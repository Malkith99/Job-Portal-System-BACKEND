const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");

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


//if you want email verification delete those two line 39 and 40
        await User.updateOne({_id:user._id},{$set:{verified:true}});
        res.status(201).json({ message: "User has been successfully signed up" });





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








module.exports = router;