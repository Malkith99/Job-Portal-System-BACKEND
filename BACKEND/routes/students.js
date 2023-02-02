const router=require("express").Router();      // import the empress package get Router()
let Student= require("../models/Student");
// CRUD Operations
 //          httP://localhost:8070/student/add
router.route("/add").post((req,res)=>{

    const name=req.body.name;
    const age=req.body.age;
    const gender=req.body.gender;

})              