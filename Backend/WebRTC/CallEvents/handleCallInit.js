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

        // Check if caller already has an active call
        const callerCurrentCall = await presenceManager.getUserCurrentCall(callerId);
        if (callerCurrentCall) {
            socket.emit("call:error", { 
                message: "You are already in an active call.",
                currentCall: callerCurrentCall.callId
            });
            return;
        }

        // Check if caller has a pending outgoing call request
        const callerPendingOutgoing = await presenceManager.getPendingOutgoingCall(callerId);
        if (callerPendingOutgoing) {
            socket.emit("call:error", { 
                message: "You already have a pending outgoing call. Please wait for response or cancel it.",
                pendingCall: true
            });
            return;
        }

        // Check if callee already has an active call
        const calleeCurrentCall = await presenceManager.getUserCurrentCall(calleeId);
        if (calleeCurrentCall) {
            socket.emit("call:error", { 
                message: "User is currently in another call.",
                busy: true
            });
            return;
        }

        // Check if there's already a pending request to this user
        const existingRequest = await presenceManager.getCallRequest(callerId, calleeId);
        if (existingRequest) {
            socket.emit("call:error", { 
                message: "Call request already sent to this user. Please wait for response."
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
        const [isCallerOnline, isCallerInCall, isCalleeInCall] = await Promise.all([
            presenceManager.isOnline(callerId),
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

        // Check if callee is already in a call
        if (isCalleeInCall) {
            socket.emit("call:error", { 
                message: "User is currently in another call.",
                busy: true
            });
            return;
        }

        // Create call request in Redis
        const callRequestId = await presenceManager.createCallRequest(callerId, calleeId, data.offer);
        console.log(`[Call Request Created] ${callRequestId}`);

        // Set 60-second timeout for call response
        const callTimeout = setTimeout(async () => {
            console.log(`[Call Timeout] No answer from ${calleeId}`);
            
            // Delete call request from Redis
            await presenceManager.deleteCallRequest(callerId, calleeId);
            
            // Notify caller about no answer
            io.to(callerId).emit("call:no-answer", {
                calleeId
            });
            
            // Clear timeout reference from socket
            delete socket.callTimeout;
        }, 60000); // 60 seconds

        // Store timeout in socket for cleanup if needed
        socket.callTimeout = callTimeout;

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