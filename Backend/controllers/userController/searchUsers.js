import { asyncHandler } from "../../Utils/asyncHandler.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { ApiError } from "../../Utils/apiError.js";
import trieService from "../../services/search.service.js";
import database from "../../db/dbService.js";

export const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;
    // const currentUserId = req.user.userID;
    const currentUserId = 1;
    if (!query || query.trim().length < 2) {
        throw new ApiError(400, "Search query must be at least 2 characters");
    }

    try {
        // Get matching words from Trie
        const matches = trieService.searchContacts(query.trim());

        if (!matches || matches.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, "No users found", [])
            );
        }

        // Extract unique user IDs from Trie results
        const userIds = [];
        const seenIds = new Set();

        for (const match of matches) {
            // Get users by matching name or email
            const users = await database.prismaService.prismaClientObject.user.findMany({
                where: {
                    OR: [
                        { fullName: { contains: match, mode: 'insensitive' } },
                        { email: { contains: match, mode: 'insensitive' } }
                    ],
                    NOT: {
                        userID: currentUserId
                    }
                },
                select: {
                    userID: true
                }
            });

            users.forEach(user => {
                if (!seenIds.has(user.userID)) {
                    seenIds.add(user.userID);
                    userIds.push(user.userID);
                }
            });
        }

        if (userIds.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, "No users found", [])
            );
        }

        // Get full user details from database
        const foundUsers = await database.prismaService.prismaClientObject.user.findMany({
            where: {
                userID: { in: userIds }
            },
            select: {
                userID: true,
                fullName: true,
                email: true,
                profilePicture: true
            },
            take: 10
        });

        return res.status(200).json(
            new ApiResponse(200, "Users found successfully",foundUsers)
        );
    } catch (error) {
        console.error("Search error:", error);
        throw new ApiError(500, "Error searching users");
    }
});

