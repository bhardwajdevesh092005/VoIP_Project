import { RedisKeys } from "./redisKeys.js";

/**
 * Manages pending call requests before they become active calls
 */
class CallRequestManager {
    constructor(redis) {
        this.redis = redis;
    }

    /**
     * Create a call request and store it in Redis
     * @param {string} callerId - ID of the user initiating the call
     * @param {string} calleeId - ID of the user being called
     * @param {object} offer - WebRTC offer object
     * @returns {string} callRequestId
     */
    async createCallRequest(callerId, calleeId, offer) {
        try {
            const callRequestId = `${callerId}:${calleeId}`;
            const callRequestKey = RedisKeys.callRequest(callerId, calleeId);
            
            // Store call request data with 60-second TTL
            const multi = this.redis.multi();
            multi.hSet(callRequestKey, {
                callerId: callerId.toString(),
                calleeId: calleeId.toString(),
                offer: JSON.stringify(offer),
                status: 'pending',
                createdAt: Date.now().toString()
            });
            multi.expire(callRequestKey, 60); // 60 seconds TTL
            multi.sAdd(RedisKeys.activeCallRequests, callRequestId);
            await multi.exec();
            
            return callRequestId;
        } catch (error) {
            console.error(`Error creating call request:`, error);
            throw error;
        }
    }

    /**
     * Get call request data
     * @param {string} callerId 
     * @param {string} calleeId 
     * @returns {object|null} Call request data or null
     */
    async getCallRequest(callerId, calleeId) {
        try {
            const callRequestKey = RedisKeys.callRequest(callerId, calleeId);
            const data = await this.redis.hGetAll(callRequestKey);
            
            if (!data || Object.keys(data).length === 0) {
                return null;
            }
            
            return {
                ...data,
                offer: JSON.parse(data.offer),
                createdAt: parseInt(data.createdAt)
            };
        } catch (error) {
            console.error(`Error getting call request:`, error);
            return null;
        }
    }

    /**
     * Delete call request from Redis
     * @param {string} callerId 
     * @param {string} calleeId 
     */
    async deleteCallRequest(callerId, calleeId) {
        try {
            const callRequestId = `${callerId}:${calleeId}`;
            const callRequestKey = RedisKeys.callRequest(callerId, calleeId);
            
            const multi = this.redis.multi();
            multi.del(callRequestKey);
            multi.sRem(RedisKeys.activeCallRequests, callRequestId);
            await multi.exec();
        } catch (error) {
            console.error(`Error deleting call request:`, error);
        }
    }

    /**
     * Check if user has a pending incoming call request
     * @param {string} userId 
     * @returns {object|null} Call request data if exists
     */
    async getPendingIncomingCall(userId) {
        try {
            const activeRequests = await this.redis.sMembers(RedisKeys.activeCallRequests);
            
            // Find any request where this user is the callee
            for (const requestId of activeRequests) {
                const [callerId, calleeId] = requestId.split(':');
                if (calleeId === userId.toString()) {
                    const request = await this.getCallRequest(callerId, calleeId);
                    if (request && request.status === 'pending') {
                        return request;
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error(`Error getting pending incoming call:`, error);
            return null;
        }
    }

    /**
     * Check if user has a pending outgoing call request (where user is the caller)
     * @param {string} userId 
     * @returns {object|null} Call request data if exists
     */
    async getPendingOutgoingCall(userId) {
        try {
            const activeRequests = await this.redis.sMembers(RedisKeys.activeCallRequests);
            
            // Find any request where this user is the caller
            for (const requestId of activeRequests) {
                const [callerId, calleeId] = requestId.split(':');
                if (callerId === userId.toString()) {
                    const request = await this.getCallRequest(callerId, calleeId);
                    if (request && request.status === 'pending') {
                        return request;
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error(`Error getting pending outgoing call:`, error);
            return null;
        }
    }
}

export default CallRequestManager;
