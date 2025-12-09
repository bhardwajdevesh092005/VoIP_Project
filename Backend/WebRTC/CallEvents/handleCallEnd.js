export const handle_call_end = async (socket, io, data, presenceManager) => {
    try {
        const userId = socket.user.id.toString();
        
        // Get user's current active call
        const currentCall = await presenceManager.getUserCurrentCall(userId);
        
        if (!currentCall) {
            socket.emit("call:error", {
                message: "No active call to end."
            });
            return;
        }

        const { callId, callerId, calleeId } = currentCall;
        
        // Determine the other user in the call
        const otherUserId = userId === callerId ? calleeId : callerId;
        
        console.log(`[Call End] User ${userId} ending call ${callId}`);
        
        // End the active call in Redis and persist history if the call was connected
        await presenceManager.endActiveCall(callId, {
            persist: true,
            endedBy: userId,
            reason: "user-ended"
        });
        
        // Mark both users as out of call
        await Promise.all([
            presenceManager.markOutOfCall(callerId),
            presenceManager.markOutOfCall(calleeId)
        ]);
        
        // Notify the other user that call has ended
        io.to(otherUserId).emit("call:ended", {
            callId,
            endedBy: userId
        });
        
        // Confirm to the user who ended the call
        socket.emit("call:ended", {
            callId,
            endedBy: userId
        });
        
        console.log(`[Call Ended] ${callId} by ${userId}`);
        
    } catch (error) {
        console.error("Error handling call end:", error);
        socket.emit("call:error", {
            message: "An error occurred while ending the call."
        });
    }
};
