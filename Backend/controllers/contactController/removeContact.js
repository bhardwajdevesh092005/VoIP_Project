import { ApiError } from "../../Utils/apiError.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import database from '../../db/dbService.js'

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
    await database.prismaService.prismaClientObject.contactRequest.delete({
        where:{
            requestId: reqId
        }
    });
    res.status(200).json(new ApiResponse(
        200,
        "Contact Removed Successfully",
        null
    ));
})