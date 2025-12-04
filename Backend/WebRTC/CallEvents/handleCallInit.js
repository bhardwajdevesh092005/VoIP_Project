export const handle_call_init = async (socket, io, data, presenceManager) => {
    try {
        // Validate input early
        if (!data || typeof data.calleeId === 'undefined' || data.calleeId === null) {
            socket.emit("call:error", { 
                message: "Invalid call request. Missing calleeId." 
            });
            return;
        }

        if (!data.offer || typeof data.offer !== 'object') {
            socket.emit("call:error", { 
                message: "Invalid call request. Invalid or missing SDP offer." 
            });
            return;
        }

        const callerId = socket.user.id.toString();
        const calleeId = data.calleeId.toString();

        // Prevent self-calling
        if (callerId === calleeId) {
            socket.emit("call:error", { 
                message: "Cannot call yourself." 
            });
            return;
        }

        // Verify users are friends
        const friends = await presenceManager.getAllFriends(callerId);
        if (!friends.includes(calleeId)) {
            socket.emit("call:error", { 
                message: "You can only call your contacts." 
            });
            return;
        }

        // Parallelize all status checks to avoid race conditions
        const [isCallerOnline, isCalleeOnline, isCallerInCall, isCalleeInCall] = await Promise.all([
            presenceManager.isOnline(callerId),
            presenceManager.isOnline(calleeId),
            presenceManager.isInCall(callerId),
            presenceManager.isInCall(calleeId)
        ]);

        // Check if caller is online (may have been disconnected from another tab)
        if (!isCallerOnline) {
            socket.emit("call:error", { 
                message: "You are offline. Please reload the page.",
                requireReload: true
            });
            return;
        }

        // Check if caller is already in a call
        if (isCallerInCall) {
            socket.emit("call:error", { 
                message: "You are already in a call." 
            });
            return;
        }

        // Check if callee is online
        if (!isCalleeOnline) {
            socket.emit("call:error", { 
                message: "User is offline." 
            });
            return;
        }

        // Check if callee is already in a call
        if (isCalleeInCall) {
            socket.emit("call:error", { 
                message: "User is currently in another call.",
                busy: true
            });
            return;
        }

        console.log(`[Call] ${callerId} -> ${calleeId}`);

        // Notify the callee about the incoming call
        // Note: Caller and callee will be marked as "in-call" only after callee accepts
        io.to(calleeId).emit("call:incoming", {
            callerId,
            offer: data.offer
        });

    } catch (error) {
        console.error("[Call Init Error]", error.message);
        socket.emit("call:error", { 
            message: `An error occurred while initiating the call: ${error.message}`     
        });
    }
};