const functions = require("firebase-functions");
const express = require('express');
const {connectToDB} = require('./src/config/connect_db.js');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({origin: true}));


const {API_PORT, MONGO_URI} = process.env
const port = process.env.PORT || API_PORT;


// connecting to mongoDb atlas
connectToDB();


// importing routes
const ExpertRoutes = require('./src/routes/tax_expert_routes.js');
const UserRoutes = require('./src/routes/user_routes.js');

app.use("/api/tax-expert", ExpertRoutes);
app.use("/api/user", UserRoutes);


// creating server
app.listen(port, () => {
    console.log(`server started at port: ${port}`);
});


exports.app = functions.https.onRequest(app);

