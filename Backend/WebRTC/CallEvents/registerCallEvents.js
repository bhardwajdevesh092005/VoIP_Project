export const registerCallEvents = (socket,io, presenceManager) =>{
    socket.on("call:initiate", (data) => handle_call_init(socket,io,data, presenceManager));
}