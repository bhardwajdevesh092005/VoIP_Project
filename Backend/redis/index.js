import {createClient} from "redis";
import dotenv from "dotenv";

dotenv.config();

class RedisService {
    constructor() {
        this.redis = new createClient({
            url: process.env.REDIS_URL,
        });
    }

    registeConnectionListeners() {
        this.redis.on("connect", () => {
            console.log("Connected to the redis database");
        });
        this.redis.on("error", (err) => {
            console.log("Redis Error:", err);
        });
        this.redis.on("end", () => {
            console.log("Disconnected from the redis");
        });
        this.redis.on("reconnecting", () => {
            console.log("Reconnecting to Redis");
        });
    }

    connectRedis = async () => {
        try {
            await this.redis.connect();
            console.log("Connected to the redis database");
        } catch (error) {
            console.log(
                "Could not connect to the redis database due to:",
                error.message
            );
        }
    };

    disconnectRedis = async () => {
        try {
            await redis.disconnect();
            console.log("Disconneced from the redis database");
        } catch (error) {
            console.log(
                "Could not disconnect from the redis database due to:",
                error.message
            );
        }
    };
}

export default RedisService;
