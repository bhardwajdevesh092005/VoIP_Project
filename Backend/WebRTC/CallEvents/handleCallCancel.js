export const handle_call_cancel = async (socket, io, data, presenceManager) => {
    try {
        const userId = socket.user.id.toString();
        
        // First, check if there's a pending call request (not yet accepted)
        const callRequest = await presenceManager.getPendingOutgoingCall(userId);
        
        if (callRequest) {
            const { callerId, calleeId } = callRequest;
            
            console.log(`[Call Request Cancel] User ${userId} canceling call request to ${calleeId}`);
            
            // Delete the call request
            await presenceManager.deleteCallRequest(callerId, calleeId);
            
            // Mark both users as out of call
            await Promise.all([
                presenceManager.markOutOfCall(callerId),
                presenceManager.markOutOfCall(calleeId)
            ]);
            
            // Notify the callee that call request has been cancelled
            io.to(calleeId).emit("call:cancelled", {
                cancelledBy: userId
            });
            
            // Confirm to the caller
            socket.emit("call:cancelled", {
                cancelledBy: userId
            });
            
            console.log(`[Call Request Cancelled] by ${userId}`);
            return;
        }
        
        // If no call request, check for active call
        const currentCall = await presenceManager.getUserCurrentCall(userId);
        
        if (!currentCall) {
            socket.emit("call:error", {
                message: "No active call or call request to cancel."
            });
            return;
        }

        const { callId, callerId, calleeId, status } = currentCall;
        
        // Ensure the user canceling is the caller
        if (userId !== callerId) {
            socket.emit("call:error", {
                message: "Only the caller can cancel a call."
            });
            return;
        }

        // If call is already accepted/connected, return error
        if (status === 'accepted' || status === 'connected') {
            socket.emit("call:error", {
                message: "Cannot cancel an already accepted call. Use call:end instead."
            });
            return;
        }
        
        console.log(`[Call Cancel] User ${userId} canceling call ${callId}`);
        
        // End the active call in Redis
        await presenceManager.endActiveCall(callId);
        
        // Mark both users as out of call
        await Promise.all([
            presenceManager.markOutOfCall(callerId),
            presenceManager.markOutOfCall(calleeId)
        ]);
        
        // Notify the callee that call has been cancelled
        io.to(calleeId).emit("call:cancelled", {
            callId,
            cancelledBy: userId
        });
        
        // Confirm to the caller
        socket.emit("call:cancelled", {
            callId,
            cancelledBy: userId
        });
        
        console.log(`[Call Cancelled] ${callId} by ${userId}`);
        
    } catch (error) {
        console.error("Error handling call cancel:", error);
        socket.emit("call:error", {
            message: "An error occurred while canceling the call."
        });
    }
};
