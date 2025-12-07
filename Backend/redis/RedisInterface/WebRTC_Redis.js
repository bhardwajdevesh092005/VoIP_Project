import database from "../../db/dbService.js";
import {RedisKeys} from "./redisKeys.js";

class PresenceService {
    constructor (redis, io) {
        this.redis = redis; // node-redis client
        this.io = io; // socket.io server
        this.FRIENDS_TTL = 86400; // 24 hours in seconds
    }

    async markOnline (userId) {
        try {
            const friendsKey = RedisKeys.friends(userId);
            
            // Check if friends set exists in Redis
            const friendsExist = await this.redis.exists(friendsKey);
            
            if (!friendsExist) {
                // Friends set doesn't exist, fetch from database
                const contacts = await database.prismaService.prismaClientObject.contactRequest.findMany({
                    where: {
                        AND: [
                            {status: 1},
                            {
                                OR: [
                                    {senderId: Number(userId)},
                                    {recieverId: Number(userId)}
                                ]
                            }
                        ]
                    }
                });

                const friendIds = contacts.map(contact => 
                    contact.senderId === userId ? contact.recieverId.toString() : contact.senderId.toString()
                );
                
                if (friendIds.length === 0) {
                    // No friends, just add to online set using transaction
                    const multi = this.redis.multi();
                    multi.sAdd(RedisKeys.presenceOnline, userId.toString());
                    await multi.exec();
                    return;
                }

                // Populate friends set with TTL using transaction
                const multi = this.redis.multi();
                multi.sAdd(friendsKey, friendIds);
                multi.expire(friendsKey, this.FRIENDS_TTL);
                multi.sAdd(RedisKeys.presenceOnline, userId.toString());
                await multi.exec();
            } else {
                // Friends set exists, remove TTL (persist) and add to online set using transaction
                const multi = this.redis.multi();
                multi.persist(friendsKey);
                multi.sAdd(RedisKeys.presenceOnline, userId.toString());
                await multi.exec();
            }

            // Parallelize sInter calls to get friends who are currently online or in-call
            const [onlineFriends, inCallFriends] = await Promise.all([
                this.redis.sInter([
                    friendsKey,
                    RedisKeys.presenceOnline
                ]),
                this.redis.sInter([
                    friendsKey,
                    RedisKeys.presenceInCall
                ])
            ]);

            // Notify all online friends (exclude self)
            for (const friendId of onlineFriends) {
                if (friendId !== userId.toString()) {
                    this.io.to(friendId).emit("friend_online", { userId: userId.toString() });
                }
            }

            // Notify all in-call friends
            for (const friendId of inCallFriends) {
                this.io.to(friendId).emit("friend_online", { userId: userId.toString() });
            }
        } catch (error) {
            console.error(`Error in markOnline for user ${userId}:`, error);
            throw error;
        }
    }

    async markOffline (userId) {
        try {
            const friendsKey = RedisKeys.friends(userId);
            
            // Fetch friends list first
            const friends = await this.redis.sMembers(friendsKey);

            if (friends.length === 0) {
                // No friends, just remove from presence sets using transaction
                const multi = this.redis.multi();
                multi.sRem(RedisKeys.presenceOnline, userId.toString());
                multi.sRem(RedisKeys.presenceInCall, userId.toString());
                await multi.exec();
                return;
            }

            // Parallelize sInter calls BEFORE removing user from presence sets
            const [onlineFriends, inCallFriends] = await Promise.all([
                this.redis.sInter([
                    friendsKey,
                    RedisKeys.presenceOnline
                ]),
                this.redis.sInter([
                    friendsKey,
                    RedisKeys.presenceInCall
                ])
            ]);

            // Use transaction to remove from presence sets and set TTL on friends set atomically
            const multi = this.redis.multi();
            multi.sRem(RedisKeys.presenceOnline, userId.toString());
            multi.sRem(RedisKeys.presenceInCall, userId.toString());
            multi.expire(friendsKey, this.FRIENDS_TTL);
            await multi.exec();

            // Notify all online friends
            for (const friendId of onlineFriends) {
                if (friendId !== userId.toString()) {
                    this.io.to(friendId).emit("friend_offline", { userId: userId.toString() });
                }
            }

            // Notify all in-call friends
            for (const friendId of inCallFriends) {
                this.io.to(friendId).emit("friend_offline", { userId: userId.toString() });
            }
        } catch (error) {
            console.error(`Error in markOffline for user ${userId}:`, error);
            throw error;
        }
    }

    async markInCall (userId) {
        try {
            // First, get friend intersections BEFORE modifying presence sets
            const [onlineFriends, inCallFriends] = await Promise.all([
                this.redis.sInter([
                    RedisKeys.friends(userId),
                    RedisKeys.presenceOnline
                ]),
                this.redis.sInter([
                    RedisKeys.friends(userId),
                    RedisKeys.presenceInCall
                ])
            ]);

            // Now move user from online to in-call set using transaction
            const multi = this.redis.multi();
            multi.sRem(RedisKeys.presenceOnline, userId.toString());
            multi.sAdd(RedisKeys.presenceInCall, userId.toString());
            await multi.exec();

            // Notify all online friends (exclude self, though shouldn't be in there)
            for (const friendId of onlineFriends) {
                if (friendId !== userId.toString()) {
                    this.io.to(friendId).emit("friend_in_call", { userId: userId.toString() });
                }
            }

            // Notify all in-call friends
            for (const friendId of inCallFriends) {
                this.io.to(friendId).emit("friend_in_call", { userId: userId.toString() });
            }
        } catch (error) {
            console.error(`Error in markInCall for user ${userId}:`, error);
            throw error;
        }
    }

    async markOutOfCall (userId) {
        try {
            // First, get friend intersections BEFORE modifying presence sets
            const [onlineFriends, inCallFriends] = await Promise.all([
                this.redis.sInter([
                    RedisKeys.friends(userId),
                    RedisKeys.presenceOnline
                ]),
                this.redis.sInter([
                    RedisKeys.friends(userId),
                    RedisKeys.presenceInCall
                ])
            ]);

            // Now move user from in-call back to online set using transaction
            const multi = this.redis.multi();
            multi.sRem(RedisKeys.presenceInCall, userId.toString());
            multi.sAdd(RedisKeys.presenceOnline, userId.toString());
            await multi.exec();

            // Notify all online friends
            for (const friendId of onlineFriends) {
                if (friendId !== userId.toString()) {
                    this.io.to(friendId).emit("friend_out_of_call", { userId: userId.toString() });
                }
            }

            // Notify all in-call friends (exclude self in case of race condition)
            for (const friendId of inCallFriends) {
                if (friendId !== userId.toString()) {
                    this.io.to(friendId).emit("friend_out_of_call", { userId: userId.toString() });
                }
            }
        } catch (error) {
            console.error(`Error in markOutOfCall for user ${userId}:`, error);
            throw error;
        }
    }

    async isOnline (userId) {
        return await this.redis.sIsMember(RedisKeys.presenceOnline, userId.toString());
    }

    async isInCall (userId) {
        return await this.redis.sIsMember(RedisKeys.presenceInCall, userId.toString());
    }

    async getOnlineFriends (userId) {
        // Intersection of user's friends and global online set
        return await this.redis.sInter([
            RedisKeys.friends(userId),
            RedisKeys.presenceOnline
        ]);
    }

    async getInCallFriends (userId) {
        // Intersection of user's friends and global in-call set
        return await this.redis.sInter([
            RedisKeys.friends(userId),
            RedisKeys.presenceInCall
        ]);
    }

    async getAllFriends (userId) {
        return await this.redis.sMembers(RedisKeys.friends(userId));
    }

    /**
     * Add a friend relationship to Redis (when contact request is accepted)
     * @param {string} userId1 - First user ID
     * @param {string} userId2 - Second user ID
     */
    async addFriend(userId1, userId2) {
        try {
            const user1FriendsKey = RedisKeys.friends(userId1);
            const user2FriendsKey = RedisKeys.friends(userId2);
            
            // Add each user to the other's friends set
            const multi = this.redis.multi();
            multi.sAdd(user1FriendsKey, userId2.toString());
            multi.sAdd(user2FriendsKey, userId1.toString());
            
            // Set TTL on both friend sets (will be removed when they come online)
            multi.expire(user1FriendsKey, this.FRIENDS_TTL);
            multi.expire(user2FriendsKey, this.FRIENDS_TTL);
            
            await multi.exec();
            
            console.log(`[Redis] Added friend relationship: ${userId1} <-> ${userId2}`);
        } catch (error) {
            console.error(`Error adding friend relationship:`, error);
            throw error;
        }
    }

    /**
     * Remove a friend relationship from Redis (when contact is removed)
     * @param {string} userId1 - First user ID
     * @param {string} userId2 - Second user ID
     */
    async removeFriend(userId1, userId2) {
        try {
            const user1FriendsKey = RedisKeys.friends(userId1);
            const user2FriendsKey = RedisKeys.friends(userId2);
            
            // Remove each user from the other's friends set
            const multi = this.redis.multi();
            multi.sRem(user1FriendsKey, userId2.toString());
            multi.sRem(user2FriendsKey, userId1.toString());
            
            await multi.exec();
            
            console.log(`[Redis] Removed friend relationship: ${userId1} <-> ${userId2}`);
        } catch (error) {
            console.error(`Error removing friend relationship:`, error);
            throw error;
        }
    }

    // ========== Call Request Management ==========
    
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
            
            // Store call request data with 90-second TTL (30 seconds more than timeout)
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

    // ========== Active Call Management ==========
    
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
            
            return {
                ...data,
                offer: JSON.parse(data.offer),
                answer: JSON.parse(data.answer),
                startedAt: parseInt(data.startedAt)
            };
        } catch (error) {
            console.error(`Error getting user current call:`, error);
            return null;
        }
    }

    /**
     * End an active call
     * @param {string} callId 
     */
    async endActiveCall(callId) {
        try {
            const activeCallKey = RedisKeys.activeCall(callId);
            const callData = await this.redis.hGetAll(activeCallKey);
            
            if (!callData || Object.keys(callData).length === 0) {
                return;
            }
            
            const { callerId, calleeId } = callData;
            
            const multi = this.redis.multi();
            multi.del(activeCallKey);
            multi.sRem(RedisKeys.activeCalls, callId);
            multi.del(RedisKeys.userCurrentCall(callerId));
            multi.del(RedisKeys.userCurrentCall(calleeId));
            await multi.exec();
        } catch (error) {
            console.error(`Error ending active call:`, error);
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
     * Check if both users in a call are offline
     * @param {string} callId 
     * @returns {boolean}
     */
    async areBothUsersOffline(callId) {
        try {
            const activeCallKey = RedisKeys.activeCall(callId);
            const callData = await this.redis.hGetAll(activeCallKey);
            
            if (!callData || Object.keys(callData).length === 0) {
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
                await this.endActiveCall(currentCall.callId);
            }
            
            // Delete any pending call requests where user is caller
            const activeRequests = await this.redis.sMembers(RedisKeys.activeCallRequests);
            for (const requestId of activeRequests) {
                const [callerId, calleeId] = requestId.split(':');
                if (callerId === userId.toString()) {
                    await this.deleteCallRequest(callerId, calleeId);
                }
            }
            
            // Remove user from current call reference
            await this.redis.del(RedisKeys.userCurrentCall(userId));
        } catch (error) {
            console.error(`Error cleaning up user call state:`, error);
        }
    }
}

export default PresenceService;