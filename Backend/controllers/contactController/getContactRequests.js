import { asyncHandler } from "../../Utils/asyncHandler.js";
import { ApiError } from '../../Utils/apiError.js'
import database from '../../db/dbService.js'
import { ApiResponse } from '../../Utils/apiResponse.js'

export const getContactRequest = asyncHandler(async (req,res)=>{
    const id = req.user.userID;
    const { type } = req.query;
    if (type && !['sent', 'received'].includes(type)) {
        throw new ApiError(400, "Type must be either 'sent' or 'received'");
    }
    
    const whereClause = type === "sent" 
        ? { senderId: id, status: 0 } 
        : { recieverId: id, status: 0 };
    
    const resp = await database.prismaService.prismaClientObject.contactRequest.findMany({
        where: whereClause,
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
    
    if(!resp){
        throw new ApiError(500, "Could not fetch requests");
    }
    
    return res.status(200)
            .json(new ApiResponse(
                200,
                "Contact Requests Retrieved Successfully",
                resp
            )
        );
})