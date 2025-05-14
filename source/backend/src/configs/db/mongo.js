require('dotenv').config();
const mongoose = require('mongoose');

const CONNECTION_MONGODB_URL = process.env.CONNECTION_MONGODB_URL;

async function connect() {
   try {
      await mongoose.connect(CONNECTION_MONGODB_URL);
      console.log("Connect to MongoDB successfully!!!");
   } catch (error) {
      console.log("Error connecting to MongoDB server!!!", error.message);
   }
}

module.exports = { connect };