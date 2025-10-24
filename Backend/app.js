import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    origin: "*",
    credentials: true,
}));

// Basic Config
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
// app.use(express.static('/public'))
app.use(express.json({limit:"16kb"}));


//Routers
app.get("/", (req,res)=>{
    return res.send("Hello world");
})
export default app;