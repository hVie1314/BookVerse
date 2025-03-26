require('dotenv').config();
const mongoose = require('mongoose');

const dbURI = `mongodb+srv://${process.env.DB_USER}
                           :${process.env.DB_PASSWORD}
                           @${process.env.DB_HOST}
                           /${process.env.DB_NAME}`;

async function connect() {
   try {
      await mongoose.connect(dbURI);
      console.log("Connect to database successfully!!!");
   } catch (error) {
      console.log("Fail to connect to database!!!");
   }
}

module.exports = { connect };