import database from '../db/dbService.js'
import PresenceService from "../redis/RedisInterface/WebRTC_Redis.js";
import { registerCallEvents } from './CallEvents/registerCallEvents.js';

export const handle_connection = async (io, socket) => {
    const presenceManager = new PresenceService(database.redisService.redis, io);
    const userId = socket.user.id.toString();
    
    try {
        // Add the user to a room identified by their user ID first
        socket.join(userId);
        
        // Check for existing socket connections from this user
        const userSockets = await io.in(userId).fetchSockets();
        
        // Filter out the current socket to get other active sockets
        const otherSockets = userSockets.filter(s => s.id !== socket.id);
        
        if (otherSockets.length > 0) {
            // User has other active sockets - this is a true multiple tab scenario
            console.log(`[Multiple Tabs] User ${userId} has ${otherSockets.length} other active connection(s)`);
            
            // Disconnect all old sockets to allow this new one
            for (const oldSocket of otherSockets) {
                console.log(`[Disconnect Old] Disconnecting old socket ${oldSocket.id} for user ${userId}`);
                oldSocket.disconnect(true);
            }
            
            // Small delay to allow old sockets to cleanup
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Clear any pending cleanup timeout from previous disconnect
        // This handles page reload scenarios
        for (const userSocket of userSockets) {
            if (userSocket.cleanupTimeout) {
                clearTimeout(userSocket.cleanupTimeout);
                delete userSocket.cleanupTimeout;
                console.log(`[Reconnection] Cleared cleanup timeout for user ${userId}`);
            }
            if (userSocket.callCleanupTimeout) {
                clearTimeout(userSocket.callCleanupTimeout);
                delete userSocket.callCleanupTimeout;
                console.log(`[Reconnection] Cleared call cleanup timeout for user ${userId}`);
            }
        }
        
        // Check if user has a pending incoming call (reconnection scenario)
        const pendingCall = await presenceManager.getPendingIncomingCall(userId);
        if (pendingCall) {
            console.log(`[Reconnection] User ${userId} has pending call from ${pendingCall.callerId}`);
            // Re-emit the incoming call event
            socket.emit("call:incoming", {
                callerId: pendingCall.callerId,
                offer: pendingCall.offer
            });
        }
        
        // Check if user has an active call (reconnection scenario)
        const activeCall = await presenceManager.getUserCurrentCall(userId);
        if (activeCall) {
            console.log(`[Reconnection] User ${userId} has active call: ${activeCall.callId}`);
            
            // Remove expiry from the call since at least one user is back
            await presenceManager.removeActiveCallExpiry(activeCall.callId);
            
            // Notify the other user that peer is back online
            const { callerId, calleeId } = activeCall;
            const otherUserId = userId === callerId ? calleeId : callerId;
            io.to(otherUserId).emit("call:peer-online", {
                userId,
                callId: activeCall.callId
            });
            
            // Emit active call state to help frontend restore
            socket.emit("call:reconnect", {
                callId: activeCall.callId,
                callerId: activeCall.callerId,
                calleeId: activeCall.calleeId,
                offer: activeCall.offer,
                answer: activeCall.answer,
                // Determine if this user is caller or callee
                isCallee: activeCall.calleeId === userId
            });
        }
        
        // Mark user as online
        await presenceManager.markOnline(userId);
        
    } catch (err) {
        console.error("Error in connection setup:", err);
    }

    // Register all call event listeners
    registerCallEvents(socket, io, presenceManager);

    socket.on("disconnect", async () => {
        try {
            // Check if user has an active call before marking offline
            const currentCall = await presenceManager.getUserCurrentCall(userId);
            
            // Mark user as offline immediately
            await presenceManager.markOffline(userId);
            
            // If user was in a call, notify the other user about disconnection
            if (currentCall) {
                const { callerId, calleeId } = currentCall;
                const otherUserId = userId === callerId ? calleeId : callerId;
                
                console.log(`[Call Disconnect] User ${userId} disconnected from call ${currentCall.callId}`);
                
                // Notify the other user that their peer went offline
                io.to(otherUserId).emit("call:peer-offline", {
                    userId,
                    callId: currentCall.callId
                });
                
                // Check if both users are now offline
                const bothOffline = await presenceManager.areBothUsersOffline(currentCall.callId);
                if (bothOffline) {
                    console.log(`[Call Expiry] Both users offline for call ${currentCall.callId}, setting 60s expiry`);
                    await presenceManager.setActiveCallExpiry(currentCall.callId, 60);
                    
                    // Schedule call cleanup after 60 seconds if no one reconnects
                    const callCleanupTimeout = setTimeout(async () => {
                        try {
                            // Check if call still exists and both users are still offline
                            const callStillExists = await presenceManager.getUserCurrentCall(userId);
                            if (callStillExists && callStillExists.callId === currentCall.callId) {
                                const stillBothOffline = await presenceManager.areBothUsersOffline(currentCall.callId);
                                if (stillBothOffline) {
                                    console.log(`[Call Timeout] Both users failed to reconnect, ending call ${currentCall.callId}`);
                                    await presenceManager.endActiveCall(currentCall.callId, {
                                        persist: true,
                                        reason: "timeout-both-offline"
                                    });
                                    
                                    // Notify both users that call ended (in case they reconnect later)
                                    io.to(currentCall.callerId).emit("call:ended", {
                                        callId: currentCall.callId,
                                        reason: "Both users disconnected"
                                    });
                                    io.to(currentCall.calleeId).emit("call:ended", {
                                        callId: currentCall.callId,
                                        reason: "Both users disconnected"
                                    });
                                }
                            }
                        } catch (err) {
                            console.error("Error in call cleanup timeout:", err);
                        }
                    }, 60000); // 60 seconds
                    
                    socket.callCleanupTimeout = callCleanupTimeout;
                }
            }
            
            console.log(`[Disconnect] User ${userId} marked offline, scheduled cleanup in 10s`);
            
            // Schedule cleanup with grace period for temporary disconnects (e.g., navigation)
            // This prevents call state deletion during brief socket reconnections
            const cleanupTimeout = setTimeout(async () => {
                try {
                    // Check if user reconnected during grace period
                    const isOnline = await presenceManager.isOnline(userId);
                    if (!isOnline) {
                        // User is still offline, cleanup call state
                        await presenceManager.cleanupUserCallState(userId);
                        console.log(`[Cleanup] User ${userId} call state cleaned up after grace period`);
                    } else {
                        console.log(`[Cleanup] User ${userId} reconnected, skipping cleanup`);
                    }
                } catch (err) {
                    console.error("Error in cleanup timeout:", err);
                }
            }, 10000); // 10 second grace period
            
            // Store timeout reference for cleanup on reconnection
            socket.cleanupTimeout = cleanupTimeout;
        } catch (err) {
            console.error("Error marking user offline:", err);
        }
    });
}