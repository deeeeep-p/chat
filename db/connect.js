const mongoose = require("mongoose");
const connectDB = (url) => {
  return mongoose.connect(url); //this is basically a promise
};
module.exports = connectDB;
