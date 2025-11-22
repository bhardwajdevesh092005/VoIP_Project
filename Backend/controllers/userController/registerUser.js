import database from "../../db/dbService.js";
import {ApiError} from "../../Utils/apiError.js";
import {ApiResponse} from "../../Utils/apiResponse.js";
import {uploadOnCloudinary} from "../../services/cloudinary.service.js";
import fs from "fs";
import bcrypt from "bcrypt";
export const registerUser = async (req, res) => {
    const {fullName, email, password, otp} = req.body;
    const avPath = req.files?.avatar?.[0]?.path;
    if (!avPath) {
        throw new ApiError("Please provide Avatar Image");
    }
    if (!(fullName || email || password || otp)) {
        fs.unlinkSync(avPath);
        throw new ApiError(400, "Provide all the details");
    }
    const existingUser =
        await database.prismaService.prismaClientObject.user.findUnique({
            where: {
                email: email,
            },
        });
    if (existingUser) {
        fs.unlinkSync(avPath);
        throw new ApiError(409, "A User with this email already exists");
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
    const ppUrl = await uploadOnCloudinary(avPath);
    const encPass = await bcrypt.hash(password, 10);
    const user = await database.prismaService.prismaClientObject.user.create({
        data: {
            fullName,
            email,
            password: encPass,
            isEmailAuth: true,
            isGoogleAuth: false,
            profilePicture: ppUrl,
        },
    });
    const resp =
        await database.prismaService.prismaClientObject.user.findUnique({
            where: {
                userID: (await user).userID,
            },
            select: {
                userID: true,
                fullName: true,
                email: true,
                profilePicture: true,
            },
        });
    return res
        .status(201)
        .json(new ApiResponse(201, "User Created Successfully", resp));
};
