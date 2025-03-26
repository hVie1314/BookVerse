require('dotenv').config();
const mongoose = require('mongoose');

const CONNECTION_MONGODB_URL = process.env.CONNECTION_MONGODB_URL;

async function connect() {
   try {
      await mongoose.connect(CONNECTION_MONGODB_URL);
      console.log("Connect to database successfully!!!");
   } catch (error) {
      console.log("Fail to connect to database!!!");
   }
}

module.exports = { connect };