import database from "../../db/dbService.js";
import { ApiError } from "../../Utils/apiError.js";
import { ApiResponse } from "../../Utils/apiResponse.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const createRequest = asyncHandler(async (req,res)=>{
    const user = req.user;
    if(!user){
        throw new ApiError(401,"Inavlid user");
    }

    const rec_email = req.body.email;
    if (!rec_email) {
        throw new ApiError(400, "Receiver email is required");
    }

    const sender = await database.prismaService.prismaClientObject.user.findUnique({
        where: {
            userID: user.userID,
        }
    })
    if (!sender) {
        throw new ApiError(404, "Sender not found");
    }
    const reciever = await database.prismaService.prismaClientObject.user.findUnique({
        where:{
            email: rec_email
        }
    })
    if (!reciever) {
        throw new ApiError(404, "User with this email does not exist");
    }
    if(sender.userID === reciever.userID){
        throw new ApiError(400,"Bad Request: can not send the contact request to yourself.");
    }

    const cont_req_l_r = await database.prismaService.prismaClientObject.contactRequest.findFirst({
        where: {
            AND: [
                {senderId: sender.userID},
                {recieverId: reciever.userID}
            ]
        }
    });

    if(cont_req_l_r){
        throw new ApiError(400, "Bad Request: User already requested");
    }

    const cont_req_r_l = await database.prismaService.prismaClientObject.contactRequest.findFirst({
        where: {
            AND: [
                {recieverId: sender.userID},
                {senderId: reciever.userID}
            ]
        }
    })
    if(cont_req_r_l){
        throw new ApiError(400, "You have already been requested by the User for a contact request");
    }

    const created_req = await database.prismaService.prismaClientObject.contactRequest.create({
        data: {
            senderId: sender.userID,
            recieverId: reciever.userID,
            status: 0,
        }
    })

    return  res
            .status(201)
            .json(new ApiResponse(201,"Request Sent",null));
});

export {createRequest};