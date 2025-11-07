import {Server} from "socket.io";
let io = null;
const initServer = (httpServer) => {
    if (!httpServer) {
        throw new Error("Http Server unavailable");
    }
    io = new Server(httpServer);
};
export {io, initServer};
