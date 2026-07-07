
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://shivamydv9889:shivam321@bitmax.cywtwe7.mongodb.net/?appName=Bitmax", {
      
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

