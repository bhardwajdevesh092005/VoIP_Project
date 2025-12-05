import { asyncHandler } from "../../Utils/asyncHandler.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { ApiError } from "../../Utils/apiError.js";
import database from "../../db/dbService.js";
import bcrypt from "bcrypt";

const updatePassword = asyncHandler(async (req, res) => {
    const userId = req.user?.userID;
    const { newPassword, otp } = req.body;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!newPassword || !otp) {
        throw new ApiError(400, "Please provide both new password and OTP");
    }

    // Get user details
    const user = await database.prismaService.prismaClientObject.user.findUnique({
        where: {
            userID: userId,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Verify OTP
    const otp_instance = await database.prismaService.prismaClientObject.otp.findUnique({
        where: {
            email: user.email,
        },
    });

    if (!otp_instance) {
        throw new ApiError(401, "Please request OTP first");
    }

    // Check if OTP is expired (10 minutes)
    if (Date.now() - otp_instance.updatedAt.getTime() > 10 * 60 * 1000) {
        throw new ApiError(401, "OTP expired. Please request a new one");
    }

    // Verify OTP
    const isOtpCorrect = otp_instance.otp === Number(otp);
    if (!isOtpCorrect) {
        throw new ApiError(401, "Invalid OTP");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await database.prismaService.prismaClientObject.user.update({
        where: {
            userID: userId,
        },
        data: {
            password: hashedPassword,
        },
    });

    // Delete used OTP
    await database.prismaService.prismaClientObject.otp.delete({
        where: {
            email: user.email,
        },
    });

    return res.status(200).json(
        new ApiResponse(200, null, "Password updated successfully")
    );
});

export { updatePassword };
