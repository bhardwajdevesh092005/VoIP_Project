export const handle_call_ringing = async (socket, io, data, presenceManager) => {
    try {
        // Validate input
        if (!data || typeof data.callerId === 'undefined' || data.callerId === null) {
            console.error("Invalid ringing notification. Missing callerId.");
            return;
        }

        const calleeId = socket.user.id.toString();
        const callerId = data.callerId.toString();

        // Verify call request exists
        const callRequest = await presenceManager.getCallRequest(callerId, calleeId);
        if (!callRequest) {
            console.error(`Call request not found for ${callerId} -> ${calleeId}`);
            return;
        }

        console.log(`[Call Ringing] ${callerId} <- ${calleeId} is ringing`);

        // Notify caller that callee's phone is ringing
        io.to(callerId).emit("call:ringing", {
            calleeId
        });

    } catch (error) {
        console.error("Error handling call ringing:", error);
    }
};
