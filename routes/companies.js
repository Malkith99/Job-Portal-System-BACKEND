const bcrypt = require("bcryptjs");
const router = require("express").Router(); // import the empress package get Router()
const Company = require("../models/Company"); //import the  company model
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const multer = require("multer");
const err = require("multer/lib/multer-error");
const JWT_SECRET = "Thisisthesecrettoken[]"; // just assign any string



//Image uploading
const Storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    },
});


const upload=multer({
    storage:Storage
}).single('testImage')          //going to upload images using this image

router.route("/uploadImage/:id").post((req,res)=>{
    let companyID=req.params.id;
    upload(req,res,async (err)=>{
        if(err){
            console.log(err)
        }else{
            const updateProfile={
                profileImage:{
                    data:req.file.filename,
                    contentType:'image/png'
                }
            };
            try{
                const update=await Student.findByIdAndUpdate(companyID,updateProfile,{
                    returnOriginal:false,
                });
                console.log(update);
            }catch(error){
                console.log(error);
                res
                    .status(500)
                    .send({ status: "Error with updating Profile Image", error: error.message });
            }
        }
    })
});





/////////////////Register////////////////////////////
router.route("/register").post(async (req, res) => {
  // request come from front end, respond send from backend
  
  const email = req.body.email;
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ email: email }, JWT_SECRET); // get the token for relevant email



 const olduser = await Company.findOne({ email });

  //console.log(old user);
      if (olduser) {
      res.json({ error: "User Exists" }); // If the insert email is not unique it shows an error
      return;
      //console.log("User list");
    } 

  const newCompany = new Company({
    email,
    password: encryptedPassword,
  });
  
  // through model company.js this data is passed to database

   newCompany.save().then(()=>{
    res.send({ status: "Company Added to the DataBase",data:token });
   }).catch((err)=>{
    console.log(err);
   });
});

//////////////////SignIn//////////////////////

router.route("/login-company").post(async (req, res) => {
  const { email, password } = req.body;

  const company = await Company.findOne({ email }); // await use when it take time to process
  if (!company) {
    return res.json({ error: "Company not found.Please Sign Up" });
  }
  if (await bcrypt.compare(password, company.password)) {
    const token = jwt.sign({ email: company.email }, JWT_SECRET); // get the token for relevant email
    //console.log(token);
    if (res.status(201)) {
      //201-respond that created for success request
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

////// read the data in the database
//http://Localhost:1234/company/
router.route("/").get((req, res) => {
  Company.find()
    .then((companies) => {
      res.json(companies);
    })
    .catch((err) => {
      console.log(err);
    });
});

//get the data of only one company
router.route("/get/:id").get(async (req, res) => {
    let companyID = req.params.id;
    await Company.findById(companyID)
        .then((company) => {
            res.status(200).send({ status: "User fetched", company });
        })
        .catch(() => {
            console.log(err.message);
            res
                .status(500)
                .send({ status: "Error with get company", error: err.message });
        });
});

module.exports = router;
