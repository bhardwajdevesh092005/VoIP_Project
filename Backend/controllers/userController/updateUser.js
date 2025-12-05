import { asyncHandler } from "../../Utils/asyncHandler.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { ApiError } from "../../Utils/apiError.js";
import database from "../../db/dbService.js";
import { uploadOnCloudinary } from "../../services/cloudinary.service.js";
import fs from "fs";

const updateUser = asyncHandler(async (req, res) => {
    const userId = req.user?.userID;
    const { fullName } = req.body;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const updateData = {};

    // Update full name if provided
    if (fullName && fullName.trim()) {
        updateData.fullName = fullName.trim();
    }

    // Update profile picture if provided
    if (req.files?.avatar?.[0]?.path) {
        const avatarPath = req.files.avatar[0].path;
        try {
            const avatarUrl = await uploadOnCloudinary(avatarPath);
            updateData.profilePicture = avatarUrl;
        } catch (error) {
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
            throw new ApiError(500, "Failed to upload profile picture");
        }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No data provided to update");
    }

    // Update user in database
    const updatedUser = await database.prismaService.prismaClientObject.user.update({
        where: {
            userID: userId,
        },
        data: updateData,
        select: {
            fullName: true,
            email: true,
            userID: true,
            profilePicture: true,
            updatedAt: true,
            ceatedAt: true,
        },
    });

    return res.status(200).json(
        new ApiResponse(200, "Profile updated successfully", updatedUser)
    );
});

export { updateUser };
