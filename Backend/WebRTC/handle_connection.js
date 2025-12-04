import { add_event_listener } from "./addEventListener.js";
import { presenceManager } from './index.js'
import database from '../db/dbService.js'
import PresenceService from "../redis/RedisInterface/WebRTC_Redis.js";
export const handle_connection = (io, socket)=>{
    const presenceManager = new PresenceService(database.redisService.redis,io);
    // Add the user to a room identified by their user ID
    socket.join(socket.user.id);
    presenceManager.markOnline(socket.user.id).catch((err)=>{
        console.error("Error marking user online:", err);
    });

    //TODO:  Add all types of event listeners for this socket here
    

    socket.on("disconnect", ()=>{
        presenceManager.markOffline(socket.user.id).catch((err)=>{
            console.error("Error marking user offline:", err);
        });
    });
}