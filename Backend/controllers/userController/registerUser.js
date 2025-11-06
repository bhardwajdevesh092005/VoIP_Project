import database from '../../db/dbService.js'
import {ApiError} from '../../Utils/apiError.js'
import {ApiResponse} from '../../Utils/apiResponse.js'
import { uploadOnCloudinary } from '../../services/cloudinary.service.js'
import fs from 'fs'
import bcrypt from 'bcrypt'
export const registerUser = async (req,res)=>{
    const {fullName,email,password} = req.body;
    console.log(req.body)
    console.log(req.files)
    const avPath = req.files?.avatar?.[0]?.path;
    if(!avPath){
        throw new ApiError("Please provide Avatar Image");
    }
    if(!(fullName||email||password)){
        fs.unlinkSync(avPath);
        throw new ApiError(400,"Provide all the details");
    }
    const existingUser = await database.prismaService.prismaClientObject.user.findUnique({
        where:{
            email: email
        }
    });
    if(existingUser){
        console.log(existingUser)
        fs.unlinkSync(avPath)
        throw new ApiError(409,"A User with this email already exists");
    }
    
    const ppUrl = await uploadOnCloudinary(avPath);
    const encPass = await bcrypt.hash(password,10);
    const user = await database.prismaService.prismaClientObject.user.create({
        data: {
            fullName,
            email,
            password: encPass,
            isEmailAuth: true,
            isGoogleAuth: false,
            profilePicture: ppUrl
        }
    });
    const resp = await database.prismaService.prismaClientObject.user.findUnique({
        where: {
            userID: (await user).userID
        },
        select: {
            userID: true,
            fullName: true,
            email: true,
            profilePicture: true,
        }
    })
    console.log(resp);
    return res.status(201).json(new ApiResponse(201,"User Created Successfully",resp));
}