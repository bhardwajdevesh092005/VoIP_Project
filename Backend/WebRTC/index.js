import {Server} from "socket.io";
import {authenticateSocket} from "./Auth/authenticateSocket.js";
import { handle_connection } from './handle_connection.js'
let io = null;
const initServer = (httpServer) => {
    if (!httpServer) {
        throw new Error("Http Server unavailable");
    }
    io = new Server(httpServer, {
        cors: {
            origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
            credentials: true
        }
    });
    io.use(authenticateSocket);
    io.on("connection", (socket)=>handle_connection(socket));
    console.log("WebRTC Server initialized");
    return io;
};
export { initServer };