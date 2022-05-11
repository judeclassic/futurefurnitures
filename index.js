import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import http from 'http';

import { theHouseInteriorApp } from './src/v1';

const app = express();

const server = http.createServer(app);

app.use(cors());

if (process.env.ENV == 'production'){
}else{
    config({ path: "./.env" });
}

theHouseInteriorApp({ app, server });


const PORT = process.env.PORT || 8000;

server.listen(PORT, ()=>{
    console.log(`Running on Port ${PORT}`);
});