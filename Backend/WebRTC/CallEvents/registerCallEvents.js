import { handle_call_init } from "../CallEvents/handleCallInit.js";
import { handle_call_response } from "../CallEvents/handleCallResponse.js";
import { handle_call_ringing } from "../CallEvents/handleCallRinging.js";
import { handle_call_end } from "../CallEvents/handleCallEnd.js";

export const registerCallEvents = (socket, io, presenceManager) => {
    socket.on("call:initiate", (data) => handle_call_init(socket, io, data, presenceManager));
    socket.on("call:response", (data) => handle_call_response(socket, io, data, presenceManager));
    socket.on("call:ringing", (data) => handle_call_ringing(socket, io, data, presenceManager));
    socket.on("call:end", (data) => handle_call_end(socket, io, data, presenceManager));
}