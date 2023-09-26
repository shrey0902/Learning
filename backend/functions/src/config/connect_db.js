const mongoose = require('mongoose');
require('dotenv').config();
const {USER_DB_URI, EXPERT_DB_URI} = process.env

// Create a connection to the user database
const userDB = mongoose.createConnection(USER_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a connection to the expert database
const expertDB = mongoose.createConnection(EXPERT_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectToDB = async () => {
    try {
        userDB;
        expertDB;
        console.log("MongoDb connected successfully");
    } catch (error) {
        console.log("MongoDb connection error: ", error);
    }
}

module.exports = {connectToDB,userDB, expertDB};