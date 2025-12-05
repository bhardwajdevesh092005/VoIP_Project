export const RedisKeys = {
    presenceOnline: "presence:online",
    presenceInCall: "presence:incall",

    friends: (uid) => `user:${uid}:friends`,
};