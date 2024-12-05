const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydatabase";
    await mongoose.connect(MONGO_URI); // ללא פרמטרים מיותרים
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
