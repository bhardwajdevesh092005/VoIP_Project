import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {
    loginUser,
    registerUser,
    sendOtp,
    OtpLogin,
    googleAuthCallBack,
} from "../controllers/userController/index.js";
import passport from "../services/passport.service.js";
const userRoutes = Router();

userRoutes.post(
    "/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    registerUser
);
userRoutes.post("/login", loginUser);
userRoutes.post("/getOTP", sendOtp);
userRoutes.post("/otpLogin", OtpLogin);
userRoutes.get("/googleLogin",
    passport.authenticate("google", { scope: ["profile", "email"] })
)
userRoutes.get("/googleCallBack",
    passport.authenticate("google", {failureRedirect: "/login"}),
    googleAuthCallBack
)
export {userRoutes};
