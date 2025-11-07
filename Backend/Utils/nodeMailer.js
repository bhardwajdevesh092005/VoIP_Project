import {Resend} from "resend";
import {ApiError} from "./apiError.js";
import {asyncHandler} from "./asyncHandler.js";
const sendEmail = asyncHandler(async (to, html) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const {data, error} = await resend.emails.send({
        from: "VOIP <onboarding@resend.dev>",
        to: to,
        subject: "OTP for VOIP Verification",
        html: html,
    });
    if (error) {
        throw new ApiError(500, "Could not send mail", [error]);
    }
    console.log(data);
});
export {sendEmail};
