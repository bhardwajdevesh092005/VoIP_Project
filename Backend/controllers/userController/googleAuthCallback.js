import database from "../../db/dbService.js";
import { ApiError } from "../../Utils/apiError.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { generateAccessAndRefeshTokens } from "../../Utils/refreshAndAccessTokens.js";

export const googleAuthCallBack = asyncHandler(async (req, res) => {
    const email = req.user?.email;
    const googleId = req.user?.googleId;
    const name = req.user?.name;
    const picture = req.user?.picture;

    if (!email) {
        throw new ApiError(400, "Could Not generate proper google auth...email not found");
    }

    let user = await database.prismaService.prismaClientObject.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        user = await database.prismaService.prismaClientObject.user.create({
            data: {
                fullName: name || null,
                email: email,
                password: null,
                refreshToken: null, // Will be updated below
                profilePicture: picture || null,
                isGoogleAuth: true,
                isEmailAuth: false,
            }
        });
    }

    const { accessToken, refreshToken } = generateAccessAndRefeshTokens(
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
            },
        });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .redirect("http://localhost:5173");

});