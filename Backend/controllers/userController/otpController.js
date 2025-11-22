import {ApiError} from "../../Utils/apiError.js";
import {ApiResponse} from "../../Utils/apiResponse.js";
import {sendEmail} from "../../Utils/nodeMailer.js";
import database from "../../db/dbService.js";
import {asyncHandler} from "../../Utils/asyncHandler.js";
const sendOtp = asyncHandler(async (req, res) => {
    const {email} = req.body;
    if (!email) {
        throw new ApiError(400, "Provide Email Address");
    }
    // const otpToSend
    // const content = ``

    // if(acc && Date.now()-acc.updatedAt.getTime()<5*60*1000){
    //     throw new ApiError(429,"Try asking for OTP after 5 minutes");
    // }
    const otpToSend = Math.floor(100000 * Math.random());
    const resp = await sendEmail(
        email,
        `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:500px;margin:auto;padding:20px;background-color:#f9fafb;border-radius:8px;">
        <h2 style="color:#111827;text-align:center;">Login Verification</h2>
        <p style="font-size:15px;color:#374151;">Hello 👋,</p>
        <p style="font-size:15px;color:#374151;">
        Use the following One-Time Password (OTP) to log in to your account. It is valid for <strong>5 minutes</strong>.
        </p>
        <div style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:white;border-radius:6px;font-size:24px;font-weight:bold;letter-spacing:4px;">
            ${otpToSend}
        </span>
        </div>
        <p style="font-size:14px;color:#6b7280;">
        If you didn’t request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
        <p style="font-size:13px;color:#9ca3af;text-align:center;">
        © ${new Date().getFullYear()} YourAppName. All rights reserved.
        </p>
        </div>
    `
    );
    const acc = await database.prismaService.prismaClientObject.otp.findUnique({
        where: {
            email: email,
        },
    });
    if (!acc) {
        await database.prismaService.prismaClientObject.otp.create({
            data: {
                email: email,
                otp: otpToSend,
            },
        });
    } else {
        await database.prismaService.prismaClientObject.otp.update({
            where: {
                email: email,
            },
            data: {
                otp: otpToSend,
            },
        });
    }
    return res.status(200).json(new ApiResponse(200, "OTP Sent Successfully"));
});
export {sendOtp};
