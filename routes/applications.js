const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User= require('../models/User');
const StudentApplication=require('../models/Application');

router.post("/", async(req,res)=>{
    try{
        const{error}=validationResult(req.body);
        if(error){
        return res.status(400).send({ message: error.details[0].message });
        }
        const studentId=req.body.studentId;
        const items={
                companyId: req.body.companyId,
                vacancyId: req.body.vacancyId,
                companyName: req.body.companyName,
                jobPosition: req.body.jobPosition,
                responseDate: req.body.responseDate,
        };
        let application =await StudentApplication.findOne({studentId:studentId});
        if(application){
            application.items.push(items);
        }else{
            application=new StudentApplication({
                studentId:studentId,
                items:[items],
            });
                
        }
        await application.save();
        res.status(201).json(application);
        console.log("Application saved");
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Application is not saved" });
    }
});

router.get('/:studentId',async(req,res)=>{
    try{
        const studentId =req.params.studentId;
        //console.log(studentId);
        const application= await StudentApplication.findOne({studentId:studentId});
        console.log(application);
        if(!application){
            console.log("No any Applications");
            return res.status(404).send({ message: "No Applications found for this student" });
        }
        console.log(`User data retrieved to profile`);
        console.log(application.items);
        res.status(200).send(application.items);        
    }catch (error) {
        console.error(`Error retrieving user application data: ${error.message}`);
        res.status(500).send({ message: "Internal Server Error: Retrieve User  Application Data" });
    }
});

module.exports=router;