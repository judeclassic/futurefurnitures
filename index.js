const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const server = require('http').createServer(app);

if (process.env.ENV == 'production'){
}else{
    dotenv.config({ path: "./.env" });
}

app.use(cors());

require('./src/lib/connect_DB')(mongoose, {
    name: 'Future Furnitures',
});

const userRoute = require('./src/routes/user');

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use("/api/email/", userRoute);


var PORT = process.env.PORT || 6000;

server.listen(PORT, ()=>{
    console.log(`Running on Port ${PORT}`);
});