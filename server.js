// Filename: server.js

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// Middlewares
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');
app.use(express.static("uploads"));

// Database connection
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

try {
    mongoose.connect("mongodb+srv://malkithamanda:99Mathematics@cluster0.qvv4jwk.mongodb.net/jobBank_db?retryWrites=true&w=majority"
        , connectionParams);
    console.log("Connected to the database successfully");
} catch (error) {
    console.log(error);
    console.log("Could not connect to the database!");
}

// Routes
const companyRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const vacancyRoutes = require("./routes/vacancies");
const studentVacancyRoutes = require("./routes/StudentVacancies");
const responseRoutes = require("./routes/Responses");

app.use("/api/auth", authRoutes);
app.use("/api/users", companyRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/studentVacancies", studentVacancyRoutes);
app.use("/api/responses", responseRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
