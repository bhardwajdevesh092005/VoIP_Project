import database from "../../db/dbService.js";
import { RedisKeys } from "./redisKeys.js";

/**
 * Manages user online/offline presence and friend notifications
 */
class PresenceManager {
    constructor(redis, io) {
        this.redis = redis;
        this.io = io;
        this.FRIENDS_TTL = 86400; // 24 hours in seconds
    }

    async markOnline(userId) {
        try {
            const friendsKey = RedisKeys.friends(userId);
            
            // Check if friends set exists in Redis
            const friendsExist = await this.redis.exists(friendsKey);
            
            if (!friendsExist) {
                // Friends set doesn't exist, fetch from database
                const contacts = await database.prismaService.prismaClientObject.contactRequest.findMany({
                    where: {
                        AND: [
                            { status: 1 },
                            {
                                OR: [
                                    { senderId: Number(userId) },
                                    { recieverId: Number(userId) }
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

    async markOffline(userId) {
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

    async markInCall(userId) {
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

    async markOutOfCall(userId) {
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

    async isOnline(userId) {
        return await this.redis.sIsMember(RedisKeys.presenceOnline, userId.toString());
    }

    async isInCall(userId) {
        return await this.redis.sIsMember(RedisKeys.presenceInCall, userId.toString());
    }

    async getOnlineFriends(userId) {
        // Intersection of user's friends and global online set
        return await this.redis.sInter([
            RedisKeys.friends(userId),
            RedisKeys.presenceOnline
        ]);
    }

    async getInCallFriends(userId) {
        // Intersection of user's friends and global in-call set
        return await this.redis.sInter([
            RedisKeys.friends(userId),
            RedisKeys.presenceInCall
        ]);
    }

    async getAllFriends(userId) {
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
}

export default PresenceManager;
