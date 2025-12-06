import database from "../../db/dbService.js";
import { ApiError } from "../../Utils/apiError.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import PresenceService from "../../redis/RedisInterface/WebRTC_Redis.js";

export const acceptRequest = asyncHandler(async (req, res)=>{
    const requestId = req.body.requestId;
    const fait = req.body.accept;
    const request = await database.prismaService.prismaClientObject.contactRequest.findUnique({
        where: {
            requestId: Number(requestId)
        }
    })

    const user = req.user;
    if(request.senderId === user.userID){
        throw new ApiError(400, "You Can not Accept a Request Sent by You");
    }
    if(request.recieverId !== user.userID){
        throw new ApiError(401, "Do not accept the reuest send by someone else");
    }
    if(request.status === 1){
        throw new ApiError(400, "The request has already been accepted");
    }

    if(request.status === 2){
        throw new ApiError(400, "The Request has already been rejected");
    }

    const resp = await database.prismaService.prismaClientObject.contactRequest.update({
        where: {
            requestId: Number(requestId)
        },
        data: {
            status: fait
        },
        include: {
            fromUser: {
                select: {
                    userID: true,
                    fullName: true,
                    email: true
                }
            }
        }
    });

    // Update Redis friends list if request was accepted (status = 1)
    if (fait === 1) {
        try {
            const presenceManager = new PresenceService(database.redisService.redis);
            await presenceManager.addFriend(request.senderId, request.recieverId);
        } catch (error) {
            console.error("Error updating Redis friends list:", error);
            // Don't throw error - Redis update is non-critical
        }
    }

    return res.status(200)
    .json(
        new ApiResponse(200, resp, "Contact Request Accepted Successfully")
    )

})