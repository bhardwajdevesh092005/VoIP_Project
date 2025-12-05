import { asyncHandler } from "../../Utils/asyncHandler.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { ApiError } from "../../Utils/apiError.js";
import database from "../../db/dbService.js";

const getLoginStatus = asyncHandler(async (req, res) => {
    // User is already verified by verifyJwt middleware
    const userId = req.user?.userID;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    // Fetch user details from database
    const user = await database.prismaService.prismaClientObject.user.findUnique({
        where: {
            userID: userId,
        },
        select: {
            fullName: true,
            email: true,
            userID: true,
            profilePicture: true,
            isEmailAuth: true,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "User is authenticated",user)
    );
});

export { getLoginStatus };
