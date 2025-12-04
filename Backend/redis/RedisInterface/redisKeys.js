export const RedisKeys = {
    presenceOnline: "presence:online",
    presenceInCall: "presence:incall",

    friendsOnline: (uid) => `user:${uid}:friends:online`,
    friendsInCall: (uid) => `user:${uid}:friends:incall`,
};