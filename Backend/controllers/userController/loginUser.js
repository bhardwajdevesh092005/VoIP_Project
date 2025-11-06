import bcrypt from 'bcrypt'
import database from '../../db/dbService.js'
import { ApiError } from '../../Utils/apiError.js';
import {asyncHandler} from '../../Utils/asyncHandler.js'
import { generateAccessAndRefeshTokens } from '../../Utils/refreshAndAccessTokens.js';
import { ApiResponse } from '../../Utils/apiResponse.js';
const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if(!(email&&password)){
        throw new ApiError(400,"Please provide both email and password");
    }
    const user = await database.prismaService.prismaClientObject.user.findUnique({
        where:{
            email: email
        }
    });
    if(!user){
        throw new ApiError(400,"Email does not exist");
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        throw new ApiError(401,"Wrong Password");
    }
    const {accessToken,refreshToken} = generateAccessAndRefeshTokens(user.userID,email);
    await database.prismaService.prismaClientObject.user.update({
        where: {
            userID: user.userID
        },
        data: {
            refreshToken: refreshToken
        }
    })
    const loggedInUser = await database.prismaService.prismaClientObject.user.findUnique({
        where:{
            email: email
        },
        select: {
            fullName: true,
            email: true,
            userID: true,
        }
    })
    const options = {
        httpOnly : true,
        secure: true,
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,"User Logged In Successfully",{...loggedInUser,loggedIn:true})
    );
})
export {loginUser}