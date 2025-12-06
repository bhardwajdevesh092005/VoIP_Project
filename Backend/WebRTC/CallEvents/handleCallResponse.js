export const handle_call_response = async (socket, io, data, presenceManager) => {
    try {
        // Validate input early
        if (!data || typeof data.callerId === 'undefined' || data.callerId === null) {
            socket.emit("call:error", {
                message: "Invalid call response. Missing callerId."
            });
            return;
        }

        if (typeof data.accepted !== 'boolean') {
            socket.emit("call:error", {
                message: "Invalid call response. Missing or invalid 'accepted' field."
            });
            return;
        }

        const calleeId = socket.user.id.toString();
        const callerId = data.callerId.toString();

        // Prevent self-response
        if (callerId === calleeId) {
            socket.emit("call:error", {
                message: "Cannot respond to your own call."
            });
            return;
        }

        // Get the call request from Redis
        const callRequest = await presenceManager.getCallRequest(callerId, calleeId);
        if (!callRequest) {
            socket.emit("call:error", {
                message: "Call request not found or has expired."
            });
            return;
        }

        // Get caller's socket to clear timeout
        const callerSockets = await io.in(callerId).fetchSockets();
        if (callerSockets.length > 0) {
            const callerSocket = callerSockets[0];
            // Clear the timeout if it exists
            if (callerSocket.callTimeout) {
                clearTimeout(callerSocket.callTimeout);
                delete callerSocket.callTimeout;
            }
        }

        // Delete the call request from Redis
        await presenceManager.deleteCallRequest(callerId, calleeId);

        if (data.accepted) {
            // Call accepted - create active call in Redis
            if (!data.answer || typeof data.answer !== 'object') {
                socket.emit("call:error", {
                    message: "Invalid call response. Missing WebRTC answer."
                });
                // Notify caller about the error
                io.to(callerId).emit("call:error", {
                    message: "Call setup failed. Invalid response from callee."
                });
                return;
            }

            try {
                const callId = await presenceManager.createActiveCall(
                    callerId,
                    calleeId,
                    callRequest.offer,
                    data.answer
                );

                console.log(`[Active Call Created] ${callId}`);

                // Mark both users as in-call
                await Promise.all([
                    presenceManager.markInCall(callerId),
                    presenceManager.markInCall(calleeId)
                ]);

                // Notify caller that call was accepted
                io.to(callerId).emit("call:accepted", {
                    calleeId,
                    answer: data.answer,
                    callId
                });

                console.log(`[Call Accepted] ${callerId} <-> ${calleeId}`);
            } catch (error) {
                console.error("Error creating active call:", error);
                socket.emit("call:error", {
                    message: "Failed to establish call. Please try again."
                });
                io.to(callerId).emit("call:error", {
                    message: "Failed to establish call. Please try again."
                });
            }
        } else {
            // Call rejected
            io.to(callerId).emit("call:rejected", {
                calleeId,
                reason: data.reason || "User declined"
            });

            console.log(`[Call Rejected] ${callerId} -> ${calleeId}: ${data.reason || 'User declined'}`);
        }
    } catch (error) {
        console.error("Error handling call response:", error);
        socket.emit("call:error", {
            message: "An error occurred while processing the call response."
        });
    }
};