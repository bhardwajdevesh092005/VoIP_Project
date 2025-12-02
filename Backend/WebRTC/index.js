import {Server} from "socket.io";
import { authenticateSocket } from "./sock_auth.js";
import { add_event_lsitener } from "./EventListeners/AddEventListener.js";
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
    add_event_lsitener(io);
    console.log("WebRTC Server initialized");
};
export {io, initServer};
