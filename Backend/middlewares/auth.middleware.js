// Auth Middleware
import jwt from "jsonwebtoken";
import {ApiError} from "../Utils/apiError.js";
import {asyncHandler} from "../Utils/asyncHandler.js";
import database from "../db/dbService.js";
import { ApiResponse } from "../Utils/apiResponse.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
    const tokens =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    
    if (!tokens) {
        throw new ApiError(401, "Unauthorised Request");
    }
    const payload = jwt.verify(tokens, process.env.ACCESS_TOKEN_SECRET);
    
    const sender = await database.prismaService.prismaClientObject.user.findUnique({
        where: {
            userID: payload._id,
        }
    });
    if (!sender) {
        throw new ApiError(401, "Invalid Access Token");
    }
    req.user = sender;
    next();
});
