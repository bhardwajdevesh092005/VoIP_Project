import jwt from "jsonwebtoken";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import database from "../../db/dbService.js";
import { ApiError } from "../../Utils/apiError.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { generateAccessAndRefeshTokens } from "../../Utils/refreshAndAccessTokens.js";

export const refreshTokens = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "No refresh token provided");
    }

    try {
        // Verify token with secret
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await database.prismaService.prismaClientObject.user.findUnique({
            where: {
                userID: payload._id
            }
        });

        if (!user) {
            throw new ApiError(401, "Invalid refresh token - User not found");
        }

        // Verify refresh token matches the one in database
        if (user.refreshToken !== token) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Generate new tokens
        const { accessToken, refreshToken } = generateAccessAndRefeshTokens(
            user.userID,
            user.email
        );

        // Update refresh token in database
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
                    userID: user.userID,
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
            sameSite: 'none',
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, "Tokens refreshed successfully", {
                    ...loggedInUser,
                    loggedIn: true,
                })
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});