import app from "./app.js";
import dotenv from 'dotenv';
import http from 'http';
import dbService from './db/dbService.js';
dotenv.config();
const dbServiceObject = new dbService();
await dbServiceObject.connectDb();
const server = http.createServer(app);
server.listen(process.env.PORT||3000,()=>{
    console.log("Server running on port:", process.env.PORT||3000);
});