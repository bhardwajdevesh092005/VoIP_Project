import jwt from "jsonwebtoken";
import { asyncHandler } from "../Utils/asyncHandler.js";
import cookieParser from "cookie-parser";
const parseCookie = str => {
  return str
    .split(';') // Split by semicolon to get individual cookie strings
    .map(v => v.split('=')) // Split each cookie string by equals sign
    .reduce((acc, v) => {
      // Decode name and value, trim whitespace, and add to accumulator object
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {}); // Initialize accumulator as an empty object
};
export const authenticateSocket = asyncHandler(async (socket, next) => {
    try {
        const token = parseCookie(socket.request.headers.cookie)['accessToken'] || 
                      socket.request.headers['accessToken'] ||
                      socket.request.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return next(new Error("Authentication token missing"));
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        socket.user = {
            userID: decoded.userID,
            email: decoded.email
        };
        next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Authentication failed"));
    }
})