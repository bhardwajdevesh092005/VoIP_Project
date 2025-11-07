// Auth Middleware
import jwt from "jsonwebtoken";
import {ApiError} from "../Utils/apiError.js";
import {asyncHandler} from "../Utils/asyncHandler.js";
import database from "../db/dbService.js";
export const verifyJwt = asyncHandler(async (req, res, next) => {
    const tokens =
        req.cookies?.access_token ||
        req.header("Authorization")?.replace("Bearer ", "");
    if (!tokens) {
        throw new ApiError(401, "Unauthorised Request");
    }
    const payload = await jwt.verify(tokens);
    const user =
        await database.prismaService.prismaClientObject.user.findUnique({
            where: {
                userID: payload.id,
            },
        });
    req.user = user;
    next();
});
