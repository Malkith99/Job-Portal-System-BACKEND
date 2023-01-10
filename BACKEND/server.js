const express=require("express");          // declare variable and assign the package to it
const mongoose= require("mongoose");       // we can use these functions to use functionalities of each packages
const bodyParser=require("body-parser");
const cors = require("cors");
const dotenv=require("dotenv");
const app =express();
require("dotenv").config();

const PORT =process.env.PORT || 8070;
app.use(cors());                        // use the cors package
app.use(bodyParser.json())              // in mongodb there exist json format(key value pairs)
const URL=process.env.MONGODB_URL;

mongoose.connect(URL,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopologyL: true,
    useFindAndModify: false
}); 

 const connection = mongoose.connection;
 connection.once("open",()=>{
    console.log("Mongodb connection success!");
 })
 app.listen(PORT,()=> {
    console.log(`Server is up and running on port number: |${PORT}`)
 })
