import bcrypt from "bcrypt";
import database from "../../db/dbService.js";
import {ApiError} from "../../Utils/apiError.js";
import {asyncHandler} from "../../Utils/asyncHandler.js";
import {generateAccessAndRefeshTokens} from "../../Utils/refreshAndAccessTokens.js";
import {ApiResponse} from "../../Utils/apiResponse.js";
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    console.log(email,password);
    if (!(email && password)) {
        throw new ApiError(400, "Please provide both email and password");
    }
    const user =
        await database.prismaService.prismaClientObject.user.findUnique({
            where: {
                email: email,
            },
        });
    if (!user) {
        throw new ApiError(400, "Email does not exist");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Wrong Password");
    }
    const {accessToken, refreshToken} = generateAccessAndRefeshTokens(
        user.userID,
        email
    );
    await database.prismaService.prismaClientObject.user.update({
        where: {
            userID: user.userID,
        },
        data: {
            refreshToken: refreshToken,
        },
    });
    const loggedInUser =
        await database.prismaService.prismaClientObject.user.findUnique({
            where: {
                email: email,
            },
            select: {
                fullName: true,
                email: true,
                userID: true,
                updatedAt: true,
                profilePicture: true,
            },
        });
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "User Logged In Successfully", {
                ...loggedInUser,
                loggedIn: true,
            })
        );
});

const OtpLogin = asyncHandler(async (req, res) => {
    const {email, otp} = req.body;
    if (!(email && otp)) {
        throw new ApiError(401, "Please provide both email and OTP");
    }
    const user =
        await database.prismaService.prismaClientObject.user.findUnique({
            where: {
                email: email,
            },
        });
    if (!user) {
        throw new ApiError(401, "Please register first");
    }
    const otp_instance =
        await database.prismaService.prismaClientObject.otp.findUnique({
            where: {
                email: email,
            },
        });
    if (!otp_instance) {
        throw new ApiError(401, "Please request otp first");
    }
    if (Date.now() - otp_instance.updatedAt.getTime() > 10 * 60 * 1000) {
        throw new ApiError(401, "OTP Expired...Request a new One");
    }
    const isOtpCorrect = otp_instance.otp === Number(otp);
    if (!isOtpCorrect) {
        throw new ApiError(401, "Wrong One Time Password");
    }
    const {accessToken, refreshToken} = generateAccessAndRefeshTokens(
        user.userID,
        email
    );
    await database.prismaService.prismaClientObject.user.update({
        where: {
            userID: user.userID,
        },
        data: {
            refreshToken: refreshToken,
        },
    });
    const loggedInUser =
        await database.prismaService.prismaClientObject.user.findUnique({
            where: {
                email: email,
            },
            select: {
                fullName: true,
                email: true,
                userID: true,
                updatedAt: true,
                profilePicture: true,
            },
        });
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "User Logged In Successfully", {
                ...loggedInUser,
                loggedIn: true,
            })
        );
});

export {loginUser, OtpLogin};
