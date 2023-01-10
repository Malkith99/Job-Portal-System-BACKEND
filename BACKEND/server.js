const express=require("express");          // declare variable and assign the package to it
const mongoose= require("mongoose");       // we can use these functions to use functionalities of each packages
const bodyParser=require("body-parser");
const cors = require("cors");
const dotenv=require("dotenv");
const app =express();

const PORT =process.env.PORT || 8070;
app.use(cors());
app.use(bodyParser.json())