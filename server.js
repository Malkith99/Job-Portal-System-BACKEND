const express=require("express");          // declare variable and assign the package to it   
const mongoose= require("mongoose");       // we can use these functions to use functionalities of each packages
const bodyParser=require("body-parser");
const cors = require("cors");
const dotenv=require("dotenv");
const app =express();
require('dotenv').config();               // use the dotenv file which has mongodb url



const PORT =process.env.PORT || 1234;   // logical or operation
app.use(cors());                        // use the cors package
app.use(bodyParser.json())              // in mongodb there exist json format(key value pairs)

const URL=process.env.MONGODB_URL;
  
mongoose.set('strictQuery',true);

/*mongoose.connect(URL,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopologyL: true,
    useFindAndModify: false
}); */

 /*const connection = mongoose.connection;
 connection.once("open",()=>{
    console.log("Mongodb connection success!");
 })*/
const database=(module.exports=()=>{
   const connectionParams={
      useNewUrlParser: true,
      useUnifieldTopology: true,

   };
   try{
      mongoose.connect(
         "mongodb+srv://malkithamanda:99Mathematics@cluster0.qvv4jwk.mongodb.net/jobBank_db?retryWrites=true&w=majority");
         console.log("Mongodb connection success!");
   } catch(err){
      console.log(err);
      console.log("Database conncestion failed");
   }
});

 app.listen(PORT,()=> {
    console.log(`Server is up and running on port number: ${PORT}`);
 });

 database();

 const studentRouter= require("./routes/students.js");      // import students.js to studentRouter
 app.use("/student",studentRouter);              // When calling /student URL , it loads file the studentRouter that assign to studentRouter varibale
                                                   
