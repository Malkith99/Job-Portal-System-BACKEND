const bcrypt = require("bcryptjs");
const router = require("express").Router(); // import the empress package get Router()
let Student = require("../models/Student"); //import the  Student model

const jwt = require("jsonwebtoken");
const multer = require("multer");
const JWT_SECRET = "Thisisthesecrettoken[]"; // just assign any string


//Image uploading
const Storage=multer.diskStorage({
  destination:"uploades",
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  },
});


const upload=multer({
  storage:Storage
}).single('testImage')          //going to upload images using this image

router.route("/uploadImage/:id").post((req,res)=>{
  let userID=req.params.id;
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
        const update=await Student.findByIdAndUpdate(userID,updateProfile,{
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

// CRUD Operations

//adding the data to databse
//httP://localhost:8070/student/add  --- way that calling from front end to backend
router.route("/register").post(async (req, res) => {
  // request come from front end, respond send from backend

  const email = req.body.email;
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ email: email }, JWT_SECRET); // get the token for relevant email
  const olduser = await Student.findOne({ email });
  //console.log(olduser);
  if (olduser) {
    res.json({ error: "User Exists" }); // If the insert email is not unique it shows an error
    return;
    //console.log("User EXist");
  }

  const newStudent = new Student({
    email,
    password: encryptedPassword,
  });
  // through model student.js this data is passed to database
  newStudent
    .save()
    .then(() => {
      // res.json("Student Added to the DataBase")      // in json format
      res.send({ status: "Student Added to the DataBase",data:token }); // in json format
    })
    .catch((err) => {
      console.log(err);
    });
});
router.route("/studentData").post(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "error", error: "Authorizaton header missing" });
  }
  //console.log(authHeader);
  const [scheme, token] = authHeader.trim().split(" ");

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Invalid authorization header" });
  }

  try {
    const student = jwt.verify(token, JWT_SECRET);
    const studentmail = student.email;
    console.log(studentmail);

    try {
      const student = await Student.findOne({ email: studentmail });
      return res.status(200).json({ status: "ok", data: student });
    } catch (e) {
      console.log(e);
      return res.status(404).json({ status: "error", data: "Not Found" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", error: "Unauthorized Access" });
  }
});
/* router.post("/add",async(req,res)=>{
    const name=req.body.name;
    const age=Number(req.body.age);
    const gender=req.body.gender;
    try{
        await Student.create({
            name,
            age,
            gender  
        });
        res.status(200).send({status: "ok"});
    }catch(error){
        res.send({status: "error"});
    }
}); */

router.route("/login-student").post(async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email }); // await use when it take time to process
  if (!student) {
    return res.json({ error: "Student not found.Please Sign Up" });
  }
  if (await bcrypt.compare(password, student.password)) {
    const token = jwt.sign({ email: student.email }, JWT_SECRET); // get the token for relevant email
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
// read the data in the database
//http://Localhost:8070/student/
router.route("/").get((req, res) => {
  Student.find()
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      console.log(err);
    });
});
// update the data in database
//http://localhost:8070/student/update/
router.route("/update/:id").put(async (req, res) => {
  //async function is used    // "put" edit http request
  let userID = req.params.id; //params- parameter   // fetch the id which is a parameter of URL
  console.log(userID);
  const { firstName,
    middleName,
     lastName,
     indexNumber,
    DOB,
    DOG,
    gender,
    phoneNumber1,
    phoneNumber2,
    references,
    faculty,
    field,
    subSpeciality,
    projects,
eActivities} = req.body;

  const updateStudent = {
    firstName,
    middleName,
    lastName,
    indexNumber,
    DOB,
    DOG,
    gender,
    phoneNumber1,
    phoneNumber2,
    references,
    faculty,
    field,
    subSpeciality,
    projects,
    eActivities,
    profileImage,
  };

  try {
    const update = await Student.findByIdAndUpdate(userID, updateStudent, {
      returnOriginal: false,
    });

    console.log(update);

    res.status(200).send({ status: "User updated", user: update }); // send the updated data to the front end
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error with updating data", error: error.message });
  }
});

//delete the data in the database
//http://localhost:8070/student/delete/
router.route("/delete/:id").delete(async (req, res) => {
  let userID = req.params.id;

  await Student.findByIdAndDelete(userID)
    .then(() => {
      res.status(200).send({ status: "User Deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with delete user", error: err.message });
    });
});

//get the data of only one user
router.route("/get/:id").get(async (req, res) => {
  let userID = req.params.id;
  await Student.findById(userID)
    .then((student) => {
      res.status(200).send({ status: "User fetched", student });
    })
    .catch(() => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with get user", error: err.message });
    });
});

module.exports = router; //defenitly should  export
