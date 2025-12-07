import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {userRoutes} from "./routes/user.routes.js";
import { contactRoutes } from "./routes/contact.routes.js";
import callRoutes from "./routes/call.routes.js";
import session from 'express-session'
import passport from "./services/passport.service.js";
const app = express();

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.50:5173",
    "https://localhost:5173",
    "https://127.0.0.1:5173",
    "https://192.168.1.50:5173"
].filter(Boolean); // Remove undefined values

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, postman)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked origin: ${origin}`);
                callback(null, false);
            }
        },
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
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/calls", callRoutes)
export default app;
