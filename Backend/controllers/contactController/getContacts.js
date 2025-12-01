import database from "../../db/dbService.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

export const getContacts = asyncHandler(async (req,res)=>{
    const userId = req.user.userID;
    const resp = await database.prismaService.prismaClientObject.contactRequest.findMany({
        where: {
            AND: [
                {status: 1},
                {
                    OR: [
                        {senderId: userId},
                        {recieverId: userId}
                    ]
                }
            ]
        },
        include: {
            fromUser: {
                select: {
                    userID: true,
                    fullName: true,
                    email: true,
                    profilePicture: true
                }
            },
            toUser: {
                select: {
                    userID: true,
                    fullName: true,
                    email: true,
                    profilePicture: true
                }
            }
        }
    });

    return res.status(200).json(new ApiResponse(200,"Contacts Retrieved Successfully",resp));
})