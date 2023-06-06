const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("MongoDB connection success!");
        app.listen(PORT, () => {
            console.log(`Server is up and running on port number: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

// Define and use your routes here
const studentRouter = require("./routes/students.js");
app.use("/student", studentRouter);

const mycompanyRouter = require("./routes/companies.js");
app.use("/company", mycompanyRouter);
