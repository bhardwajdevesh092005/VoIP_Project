import database from "../../db/dbService.js";
import { RedisKeys } from "./redisKeys.js";

/**
 * Manages active calls and call history persistence
 */
class ActiveCallManager {
    constructor(redis) {
        this.redis = redis;
    }

    /**
     * Hydrate call data from Redis (parse JSON fields and timestamps)
     * @param {object} data - Raw data from Redis
     * @returns {object|null} Hydrated call data
     */
    hydrateCallData(data) {
        if (!data || Object.keys(data).length === 0) {
            return null;
        }

        return {
            ...data,
            offer: data.offer ? JSON.parse(data.offer) : null,
            answer: data.answer ? JSON.parse(data.answer) : null,
            startedAt: data.startedAt ? parseInt(data.startedAt) : null,
            connectedAt: data.connectedAt ? parseInt(data.connectedAt) : null,
            status: data.status || "active"
        };
    }

    /**
     * Create an active call between two users
     * @param {string} callerId 
     * @param {string} calleeId 
     * @param {object} offer 
     * @param {object} answer 
     * @returns {string} callId
     */
    async createActiveCall(callerId, calleeId, offer, answer) {
        try {
            const callId = `${callerId}:${calleeId}:${Date.now()}`;
            const activeCallKey = RedisKeys.activeCall(callId);
            
            const multi = this.redis.multi();
            multi.hSet(activeCallKey, {
                callId,
                callerId: callerId.toString(),
                calleeId: calleeId.toString(),
                offer: JSON.stringify(offer),
                answer: JSON.stringify(answer),
                startedAt: Date.now().toString(),
                status: 'active'
            });
            multi.sAdd(RedisKeys.activeCalls, callId);
            
            // Store current call for both users
            multi.set(RedisKeys.userCurrentCall(callerId), callId);
            multi.set(RedisKeys.userCurrentCall(calleeId), callId);
            
            await multi.exec();
            
            return callId;
        } catch (error) {
            console.error(`Error creating active call:`, error);
            throw error;
        }
    }

    /**
     * Mark call as connected (sets status and connectedAt timestamp)
     * @param {string} callId 
     * @returns {object|null} Updated call data
     */
    async markCallConnected(callId) {
        try {
            const activeCallKey = RedisKeys.activeCall(callId);
            const existing = await this.redis.hGetAll(activeCallKey);

            if (!existing || Object.keys(existing).length === 0) {
                return null;
            }

            if (existing.status === "connected" || existing.connectedAt) {
                return this.hydrateCallData(existing);
            }

            const connectedAt = Date.now();
            const multi = this.redis.multi();
            multi.hSet(activeCallKey, {
                status: "connected",
                connectedAt: connectedAt.toString()
            });
            await multi.exec();

            return this.hydrateCallData({
                ...existing,
                status: "connected",
                connectedAt: connectedAt.toString()
            });
        } catch (error) {
            console.error(`Error marking call connected for ${callId}:`, error);
            return null;
        }
    }

    /**
     * Get active call data by call ID
     * @param {string} callId 
     * @returns {object|null} Call data
     */
    async getActiveCall(callId) {
        try {
            const activeCallKey = RedisKeys.activeCall(callId);
            const data = await this.redis.hGetAll(activeCallKey);
            return this.hydrateCallData(data);
        } catch (error) {
            console.error(`Error getting active call ${callId}:`, error);
            return null;
        }
    }

    /**
     * Get user's current active call
     * @param {string} userId 
     * @returns {object|null} Active call data or null
     */
    async getUserCurrentCall(userId) {
        try {
            const callId = await this.redis.get(RedisKeys.userCurrentCall(userId));
            
            if (!callId) {
                return null;
            }
            
            const activeCallKey = RedisKeys.activeCall(callId);
            const data = await this.redis.hGetAll(activeCallKey);
            
            if (!data || Object.keys(data).length === 0) {
                // Cleanup stale reference
                await this.redis.del(RedisKeys.userCurrentCall(userId));
                return null;
            }
            
            return this.hydrateCallData(data);
        } catch (error) {
            console.error(`Error getting user current call:`, error);
            return null;
        }
    }

    /**
     * End an active call and optionally persist to database
     * @param {string} callId 
     * @param {object} options - { persist, endedBy, reason }
     * @returns {object|null} Persisted call record if persist=true
     */
    async endActiveCall(callId, options = {}) {
        const { persist = false, endedBy = null, reason = null } = options;

        try {
            const activeCallKey = RedisKeys.activeCall(callId);
            const rawData = await this.redis.hGetAll(activeCallKey);
            
            if (!rawData || Object.keys(rawData).length === 0) {
                return null;
            }

            const callData = this.hydrateCallData(rawData);
            let persistedRecord = null;

            if (persist && callData && callData.status === "connected") {
                persistedRecord = await this.persistCallHistory(callData, { endedBy, reason });
            }
            
            const { callerId, calleeId } = callData;
            
            const multi = this.redis.multi();
            multi.del(activeCallKey);
            multi.sRem(RedisKeys.activeCalls, callId);
            multi.del(RedisKeys.userCurrentCall(callerId));
            multi.del(RedisKeys.userCurrentCall(calleeId));
            await multi.exec();

            return persistedRecord;
        } catch (error) {
            console.error(`Error ending active call:`, error);
            return null;
        }
    }

    /**
     * Set expiry on active call (when both users disconnect)
     * @param {string} callId 
     * @param {number} ttlSeconds - Time to live in seconds (default 60)
     */
    async setActiveCallExpiry(callId, ttlSeconds = 60) {
        try {
            const activeCallKey = RedisKeys.activeCall(callId);
            
            // Set TTL on the active call hash and user current call references
            const callData = await this.redis.hGetAll(activeCallKey);
            if (!callData || Object.keys(callData).length === 0) {
                return;
            }
            
            const { callerId, calleeId } = callData;
            
            const multi = this.redis.multi();
            multi.expire(activeCallKey, ttlSeconds);
            multi.expire(RedisKeys.userCurrentCall(callerId), ttlSeconds);
            multi.expire(RedisKeys.userCurrentCall(calleeId), ttlSeconds);
            await multi.exec();
            
            console.log(`[Call Expiry] Set ${ttlSeconds}s expiry on call ${callId}`);
        } catch (error) {
            console.error(`Error setting call expiry:`, error);
        }
    }

    /**
     * Remove expiry from active call (when at least one user reconnects)
     * @param {string} callId 
     */
    async removeActiveCallExpiry(callId) {
        try {
            const activeCallKey = RedisKeys.activeCall(callId);
            
            const callData = await this.redis.hGetAll(activeCallKey);
            if (!callData || Object.keys(callData).length === 0) {
                return;
            }
            
            const { callerId, calleeId } = callData;
            
            const multi = this.redis.multi();
            multi.persist(activeCallKey); // Remove TTL
            multi.persist(RedisKeys.userCurrentCall(callerId));
            multi.persist(RedisKeys.userCurrentCall(calleeId));
            await multi.exec();
            
            console.log(`[Call Expiry] Removed expiry from call ${callId}`);
        } catch (error) {
            console.error(`Error removing call expiry:`, error);
        }
    }

    /**
     * Persist call history to PostgreSQL
     * @param {object} callData - Hydrated call data
     * @param {object} meta - Metadata like endedBy, reason
     * @returns {object|null} Database record
     */
    async persistCallHistory(callData, meta = {}) {
        try {
            if (!callData || callData.status !== "connected") {
                return null;
            }

            const startMs = callData.connectedAt || callData.startedAt;
            if (!startMs) {
                return null;
            }

            const endMs = Date.now();
            const durationSeconds = Math.max(1, Math.round((endMs - startMs) / 1000));

            const record = await database.prismaService.prismaClientObject.call.create({
                data: {
                    duration: durationSeconds,
                    startTime: new Date(startMs),
                    endTime: new Date(endMs),
                    users: {
                        connect: [
                            { userID: Number(callData.callerId) },
                            { userID: Number(callData.calleeId) }
                        ]
                    }
                }
            });

            console.log(`[Call History] Persisted call ${callData.callId} - Duration: ${durationSeconds}s`);
            return record;
        } catch (error) {
            console.error("Error persisting call history:", error);
            return null;
        }
    }
}

export default ActiveCallManager;
