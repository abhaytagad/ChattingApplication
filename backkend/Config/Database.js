const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("DB conected");
    })
    .catch((e) => {
      console.log("db not conect Succesfully");
      console.log(e);
    });
};
module.exports = connect;
