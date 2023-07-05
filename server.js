const express = require("express"); // declare variable and assign the package to it
const mongoose = require("mongoose"); // we can use these functions to use functionalities of each packages
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
require("dotenv").config(); // use the dotenv file which has mongodb url

const PORT = process.env.PORT || 4000; // (||-logical or operation)


//middlewares
app.use(cors()); // use the cors (Cross Origin Resource Sharing) package
app.use(bodyParser.json()); // in mongodb there exist json format(key value pairs)
app.use(express.json());
app.disable('x-powered-by');
mongoose.set("strictQuery", true);

const database = (module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifieldTopology: true,
  };
  try {
    mongoose.connect(
      "mongodb+srv://malkithamanda:99Mathematics@cluster0.qvv4jwk.mongodb.net/jobBank_db?retryWrites=true&w=majority"
    );
    console.log("Mongodb connection success!");
  } catch (err) {
    console.log(err);
    console.log("Database connection failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});

database();


const companyRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const vacancyRoutes = require("./routes/vacancies");
const studentVacancyRoutes = require("./routes/StudentVacancies");
const responseRoutes = require("./routes/Responses");


app.use("/api/auth", authRoutes);
app.use("/api/users",companyRoutes);
app.use("/api/vacancies",vacancyRoutes);
app.use("/api/studentVacancies",studentVacancyRoutes);
app.use("/api/responses",responseRoutes);

