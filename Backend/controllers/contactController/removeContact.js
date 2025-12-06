import { ApiError } from "../../Utils/apiError.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import database from '../../db/dbService.js'
import PresenceService from "../../redis/RedisInterface/WebRTC_Redis.js";

// Remove/Reject a contact request (pending or accepted)
export const removeContact = asyncHandler(async (req,res)=>{
    const reqId = parseInt(req.params.requestId);
    if(!reqId || isNaN(reqId)){
        throw new ApiError(400,"Invalid Request ID");
    }
    const contactRequest = await database.prismaService.prismaClientObject.contactRequest.findUnique({
        where:{
            requestId: reqId
        }
    });
    if(!contactRequest){
        throw new ApiError(404,"Contact Request Not Found");
    }
    if(contactRequest.senderId !== req.user.userID && contactRequest.recieverId !== req.user.userID){
        throw new ApiError(403, "Forbidden Action");
    }
    
    // Store IDs and status before deletion for Redis update
    const senderId = contactRequest.senderId;
    const receiverId = contactRequest.recieverId;
    const wasAccepted = contactRequest.status === 1;
    
    await database.prismaService.prismaClientObject.contactRequest.delete({
        where:{
            requestId: reqId
        }
    });

    // Update Redis friends list if the contact was accepted (removing a friend)
    if (wasAccepted) {
        try {
            const presenceManager = new PresenceService(database.redisService.redis);
            await presenceManager.removeFriend(senderId, receiverId);
        } catch (error) {
            console.error("Error updating Redis friends list:", error);
            // Don't throw error - Redis update is non-critical
        }
    }
    
    res.status(200).json(new ApiResponse(
        200,
        "Contact Removed Successfully",
        null
    ));
})