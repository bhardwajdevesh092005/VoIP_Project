import {registerUser} from "./registerUser.js";
import {loginUser, OtpLogin} from "./loginUser.js";
import {sendOtp} from "./otpController.js";
import {googleAuthCallBack} from './googleAuthCallback.js'
import { refreshTokens } from "./refreshTokens.js";
import { searchUsers } from "./searchUsers.js";
export const userControllers = {registerUser, loginUser, sendOtp, OtpLogin, googleAuthCallBack, refreshTokens, searchUsers};
