import PresenceManager from "./PresenceManager.js";
import CallRequestManager from "./CallRequestManager.js";
import ActiveCallManager from "./ActiveCallManager.js";

/**
 * Unified manager combining presence, call requests, and active calls
 * Provides utilities for checking call state and cleanup operations
 */
class CallStateManager {
    constructor(redis, io) {
        this.redis = redis;
        this.io = io;
        
        // Initialize domain managers
        this.presenceManager = new PresenceManager(redis, io);
        this.callRequestManager = new CallRequestManager(redis);
        this.activeCallManager = new ActiveCallManager(redis);
    }

    // Delegate presence methods
    async markOnline(userId) {
        return this.presenceManager.markOnline(userId);
    }

    async markOffline(userId) {
        return this.presenceManager.markOffline(userId);
    }

    async markInCall(userId) {
        return this.presenceManager.markInCall(userId);
    }

    async markOutOfCall(userId) {
        return this.presenceManager.markOutOfCall(userId);
    }

    async isOnline(userId) {
        return this.presenceManager.isOnline(userId);
    }

    async isInCall(userId) {
        return this.presenceManager.isInCall(userId);
    }

    async getOnlineFriends(userId) {
        return this.presenceManager.getOnlineFriends(userId);
    }

    async getInCallFriends(userId) {
        return this.presenceManager.getInCallFriends(userId);
    }

    async getAllFriends(userId) {
        return this.presenceManager.getAllFriends(userId);
    }

    async addFriend(userId1, userId2) {
        return this.presenceManager.addFriend(userId1, userId2);
    }

    async removeFriend(userId1, userId2) {
        return this.presenceManager.removeFriend(userId1, userId2);
    }

    // Delegate call request methods
    async createCallRequest(callerId, calleeId, offer) {
        return this.callRequestManager.createCallRequest(callerId, calleeId, offer);
    }

    async getCallRequest(callerId, calleeId) {
        return this.callRequestManager.getCallRequest(callerId, calleeId);
    }

    async deleteCallRequest(callerId, calleeId) {
        return this.callRequestManager.deleteCallRequest(callerId, calleeId);
    }

    async getPendingIncomingCall(userId) {
        return this.callRequestManager.getPendingIncomingCall(userId);
    }

    async getPendingOutgoingCall(userId) {
        return this.callRequestManager.getPendingOutgoingCall(userId);
    }

    // Delegate active call methods
    async createActiveCall(callerId, calleeId, offer, answer) {
        return this.activeCallManager.createActiveCall(callerId, calleeId, offer, answer);
    }

    async markCallConnected(callId) {
        return this.activeCallManager.markCallConnected(callId);
    }

    async getActiveCall(callId) {
        return this.activeCallManager.getActiveCall(callId);
    }

    async getUserCurrentCall(userId) {
        return this.activeCallManager.getUserCurrentCall(userId);
    }

    async endActiveCall(callId, options = {}) {
        return this.activeCallManager.endActiveCall(callId, options);
    }

    async setActiveCallExpiry(callId, ttlSeconds = 60) {
        return this.activeCallManager.setActiveCallExpiry(callId, ttlSeconds);
    }

    async removeActiveCallExpiry(callId) {
        return this.activeCallManager.removeActiveCallExpiry(callId);
    }

    /**
     * Check if both users in a call are offline
     * @param {string} callId 
     * @returns {boolean}
     */
    async areBothUsersOffline(callId) {
        try {
            const callData = await this.activeCallManager.getActiveCall(callId);
            
            if (!callData) {
                return false;
            }
            
            const { callerId, calleeId } = callData;
            
            const [callerOnline, calleeOnline] = await Promise.all([
                this.isOnline(callerId),
                this.isOnline(calleeId)
            ]);
            
            return !callerOnline && !calleeOnline;
        } catch (error) {
            console.error(`Error checking if both users offline:`, error);
            return false;
        }
    }

    /**
     * Cleanup user's call state (on disconnect)
     * @param {string} userId 
     */
    async cleanupUserCallState(userId) {
        try {
            // Get and end user's current call
            const currentCall = await this.getUserCurrentCall(userId);
            if (currentCall) {
                await this.endActiveCall(currentCall.callId, {
                    persist: true,
                    reason: "cleanup-user-offline"
                });
            }
            
            // Delete any pending call requests where user is caller
            const activeRequests = await this.redis.sMembers("calls:active_requests");
            for (const requestId of activeRequests) {
                const [callerId, calleeId] = requestId.split(':');
                if (callerId === userId.toString()) {
                    await this.deleteCallRequest(callerId, calleeId);
                }
            }
            
            // Remove user from current call reference
            await this.redis.del(`user:${userId}:current_call`);
        } catch (error) {
            console.error(`Error cleaning up user call state:`, error);
        }
    }
}

export default CallStateManager;
