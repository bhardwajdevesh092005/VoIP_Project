import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js";

import passport from "../services/passport.service.js";
import {Controllers} from "#controllers";
const userRoutes = Router();
const userControllers = Controllers.userControllers;

userRoutes.post(
    "/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    userControllers.registerUser
);
userRoutes.post("/login", userControllers.loginUser);
userRoutes.post("/getOTP", userControllers.sendOtp);
userRoutes.post("/otpLogin", userControllers.OtpLogin);
userRoutes.get("/googleLogin",
    passport.authenticate("google", { scope: ["profile", "email"] })
)
userRoutes.get("/googleCallBack",
    passport.authenticate("google", {failureRedirect: "/login"}),
    userControllers.googleAuthCallBack
)
userRoutes.get("/refreshToken", userControllers.refreshTokens)
export {userRoutes};
