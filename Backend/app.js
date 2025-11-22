import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {userRoutes} from "./routes/user.routes.js";
import session from 'express-session'
import passport from "./services/passport.service.js";
const app = express();
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

// Basic Config
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static('/public'))
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
app.get("/", (req, res) => {
    return res.send("Hello world");
});
app.use("/api/v1/user", userRoutes);
export default app;
