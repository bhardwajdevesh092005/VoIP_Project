import { connection_handler } from "./connection_handler.js";
export const add_event_lsitener = (io)=>{
    io.on("connection", (socket) => connection_handler(io, socket));
}