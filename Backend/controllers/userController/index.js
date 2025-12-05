import {registerUser} from "./registerUser.js";
import {loginUser, OtpLogin} from "./loginUser.js";
import {sendOtp} from "./otpController.js";
import {googleAuthCallBack} from './googleAuthCallback.js'
import { refreshTokens } from "./refreshTokens.js";
import { searchUsers } from "./searchUsers.js";
import { getLoginStatus } from "./getLoginStatus.js";
import { updateUser } from "./updateUser.js";
import { updatePassword } from "./updatePassword.js";
import { logoutUser } from "./logoutUser.js";
export const userControllers = {registerUser, loginUser, sendOtp, OtpLogin, googleAuthCallBack, refreshTokens, searchUsers, getLoginStatus, updateUser, updatePassword, logoutUser};
