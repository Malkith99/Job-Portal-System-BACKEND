require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const connection = require("./db");
const companyRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const vacancyRoutes = require("./routes/vacancies");
const studentVacancyRoutes = require("./routes/StudentVacancies");
const responseRoutes = require("./routes/Responses");
// database connection
connection()

// middlewares
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

// import students.js to studentRouter to
// When calling /student URL , it loads file the studentRouter that assign to studentRouter variable
// routes
app.use("/api/auth", authRoutes);
app.use("/api/users",companyRoutes);
app.use("/api/vacancies",vacancyRoutes);
app.use("/api/studentVacancies",studentVacancyRoutes);
app.use("/api/responses",responseRoutes);

app.use(express.static("uploads"));

const port =  process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
