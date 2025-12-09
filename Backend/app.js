import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {userRoutes} from "./routes/user.routes.js";
import { contactRoutes } from "./routes/contact.routes.js";
import callRoutes from "./routes/call.routes.js";
import session from 'express-session'
import passport from "./services/passport.service.js";
const app = express();
import path from "path";
import { configDotenv } from "dotenv";
configDotenv();
const __dirname = path.resolve();   
// CORS configuration
const allowedOrigins = [
    process.env.VITE_FRONTEND_URL,
    "http://localhost:5173",
    "https://127.0.0.1:5173",
    "http://192.168.1.50:5173",
    "http://dyxko-59-178-164-112.a.free.pinggy.link",
    "https?:\/\/.*\.loca\.lt$/",
].filter(Boolean); // Remove undefined values

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Basic Config
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'dist')))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
app.use(session({
    secret: "YOUR_SUPER_SECRET_KEY_123456",
    resave: false,                                                                                                                                                     
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
}))
app.use(express.json({limit: "16kb"}));
app.use(passport.initialize())
app.use(passport.session())
//Routers

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/calls", callRoutes)
app.get("/*\w", async (req, res) => {
    return res.sendFile(path.join(__dirname, "dist/index.html"));
});
export default app;
