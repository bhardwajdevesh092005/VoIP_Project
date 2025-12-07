export const handle_ice_candidate = async (socket, io, data, presenceManager) => {
    try {
        const userId = socket.user.id.toString();
        
        // Get user's current active call
        const currentCall = await presenceManager.getUserCurrentCall(userId);
        
        if (!currentCall) {
            console.log(`[ICE Candidate] No active call for user ${userId}`);
            return;
        }

        const { callerId, calleeId } = currentCall;
        
        // Determine the other user in the call
        const otherUserId = userId === callerId ? calleeId : callerId;
        
        console.log(`[ICE Candidate] Relaying from ${userId} to ${otherUserId}`);
        
        // Relay the ICE candidate to the other user
        io.to(otherUserId).emit("ice:candidate", {
            candidate: data.candidate
        });
        
    } catch (error) {
        console.error("Error handling ICE candidate:", error);
    }
};
