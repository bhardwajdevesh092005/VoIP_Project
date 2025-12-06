export const RedisKeys = {
    presenceOnline: "presence:online",
    presenceInCall: "presence:incall",

    friends: (uid) => `user:${uid}:friends`,
    
    // Call request management
    activeCallRequests: "calls:active_requests", // Set of active call request IDs
    callRequest: (callerId, calleeId) => `call:${callerId}:${calleeId}`, // Hash for call request data
    
    // Current calls
    activeCalls: "calls:active", // Set of active call IDs
    activeCall: (callId) => `call:active:${callId}`, // Hash for active call data
    
    // User's current call
    userCurrentCall: (userId) => `user:${userId}:current_call`, // String storing call ID
};