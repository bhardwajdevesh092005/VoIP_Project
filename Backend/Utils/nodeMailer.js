import nodemailer from "nodemailer";
import {ApiError} from "./apiError.js";

// Create transporter with Gmail or Ethereal (test) email
const createTransporter = async () => {
    // If Gmail credentials are provided, use Gmail
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    
    // Otherwise, create a test account with Ethereal Email (for development)
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

const sendEmail = async (to, html) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: `"VoIP App" <${process.env.EMAIL_USER || "noreply@voipapp.com"}>`,
            to: to,
            subject: "OTP for VoIP Verification",
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        
        // If using Ethereal, log the preview URL
        if (!process.env.EMAIL_USER) {
            console.log("Preview URL (Ethereal):", nodemailer.getTestMessageUrl(info));
        }
        
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError(500, "Could not send email. Please check email configuration.", [error.message]);
    }
};

export {sendEmail};
