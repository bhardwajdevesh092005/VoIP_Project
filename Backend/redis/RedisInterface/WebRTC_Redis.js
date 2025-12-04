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
                                    {senderId: userId},
                                    {recieverId: userId}
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
}

export default PresenceService;