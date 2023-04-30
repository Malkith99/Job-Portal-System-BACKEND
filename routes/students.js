const bcrypt=require("bcryptjs");
const router=require("express").Router();      // import the empress package get Router()
let Student= require("../models/Student");     //import the  Student model

const jwt=require("jsonwebtoken");
const JWT_SECRET="Thisisthesecrettoken[]"  // just assign any string

// CRUD Operations

//adding the data to databse
 //httP://localhost:8070/student/add  --- way that calling from front end to backend
router.route("/register").post(async(req,res)=>{      // request come from front end, respond send from backend 
                        
   const email=req.body.email;
   const password=req.body.password;
    const encryptedPassword=await bcrypt.hash(password,10);
    
    const olduser= await Student.findOne({email});
    //console.log(olduser);
    if(olduser){
        res.json({error:"User Exists"});        // If the insert email is not unique it shows an error
        return
       //console.log("User EXist");
    }

    const newStudent =new Student({   
        email,
        password:encryptedPassword
    })
                                                        // through model student.js this data is passed to database
    newStudent.save().then(()=>{
       // res.json("Student Added to the DataBase")      // in json format
        res.send({status:"Student Added to the DataBase"});    // in json format
    }).catch((err)=>{
        console.log(err);
    }) 

})
router.route("/studentData").post(async(req,res)=>{
    const authHeader=req.headers.authorization;
    
    if(!authHeader){
        return res.status(401).json({status:"error",error:"Authorizaton header missing"});
    }
    //console.log(authHeader);
    const [scheme, token]=authHeader.trim().split(" ");
    //console.log(token);
    /* const {token}=req.body; */
    if(scheme!=="Bearer"|| !token){
        return res.status(401).json({status: "error",error:"Invalid authorization header"});
    }
    try{
        const student=jwt.verify(token,JWT_SECRET);
        const studentmail=student.email;
        console.log(student);
        User.findOne({email: studentmail}).then((data)=>{
            //const{email}=data;
            res.send({status:"ok",data:data});
            return
        }).catch((error)=>{
            res.send({status:"error",data:error});
        });

    }catch(error){
        return res.status(401).json({ status: "error", error: "Invalid or expired token" });
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

router.route("/login-student").post(async(req,res)=>{
    const{email,password}=req.body;

    const student =await Student.findOne({email});         // await use when it take time to process
    if(!student){
        return res.json({error: "Student not found.Please Sign Up"});
    }
    if(await bcrypt.compare(password,student.password)){
        const token=jwt.sign({email:student.email},JWT_SECRET);         // get the token for relevant email
        //console.log(token);
        if(res.status(201)){                            //201-respond that created for success request
            return res.json({status: "ok",data:token});
        }else{
            return res.json({error: "error"});
        }
    }
    res.json({status:"error",error:"Invalid Password"});
})   
// read the data in the database
//http://Localhost:8070/student/
router.route("/").get((req,res)=>{
    Student.find().then((students)=>{
        res.json(students)
    }).catch((err)=>{
        console.log(err)
    })
})
// update the data in database
//http://localhost:8070/student/update/  
router.route("/update/:id").put(async(req,res)=>{       //async function is used    // "put" edit http request 
    let userID=req.params.id;   //params- parameter   // fetch the id which is a parameter of URL
    const{name,age,gender}=req.body;

    const updateStudent={
        name,
        age,
        gender
    }
    const update =await Student.findByIdAndUpdate(userID,updateStudent)// await() function is used 
    .then(()=>{     // if update is success
        res.status(200).send({status:"User updated"}) // send the updated data to the front end
    }).catch((err)=>{   // if update is failure
        console.log(err);
        res.status(500).send({status:"Error with updating data",error:err.message});
    })
    
})

//delete the data in the database
//http://localhost:8070/student/delete/
router.route("/delete/:id").delete(async(req,res)=>{
    let userID=req.params.id;

    await Student.findByIdAndDelete(userID)
    .then(()=>{
        res.status(200).send({status:"User Deleted"});
    }).catch((err)=>{
       console.log(err.message);
       res.status(500).send({status:"Error with delete user",error: err.message});
    })
})

//get the data of only one user
router.route("/get/:id").get(async(req,res)=>{
    let userID= req.params.id;
    await Student.findById(userID)
    .then((student)=>{
        res.status(200).send({status:"User fetched",student}); 
    }).catch(()=>{
        console.log(err.message);
        res.status(500).send({status:"Error with get user", error: err.message});
    })
} )




module.exports= router;  //defenitly should  export             