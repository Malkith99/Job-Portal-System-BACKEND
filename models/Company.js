const mongoose = require("mongoose");
// assign company mongoose package to const variable

const Schema = mongoose.Schema; //Schema-template of a document mongodb

const companySchema = new Schema(
    {

      email: {
        type: String,
        required: true,
        //unique: true, //  email address should be unique (only one should exist)
      },
      password: {
        type: String,
        required: true, //  required-make it required
      },

    },
    {
      timestamps: true, // tells our databse to automatically save the creation and update timestamp of each entry
    }
);

const Company = mongoose.model("Company", companySchema); //"Student"-Name of the schema
//in mongodb this creates as "students"
module.exports = Company;
