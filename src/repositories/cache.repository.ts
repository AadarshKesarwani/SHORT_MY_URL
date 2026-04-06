import { serverConfig } from "../config";
import { redisClient } from "../config/redis";




export class CacheRepository {

    // Get the next unique ID for a new URL mapping
    // This method uses Redis' INCR command to atomically increment a counter and return the new value
    // The counter is stored under a key defined in the server configuration (serverConfig.REDIS_COUNTER_KEY)
    // This method ensures that each new URL mapping gets a unique ID, which can be used to generate the short URL

    async getNextId() : Promise<number> {
        // Get the key for the counter from the server configuration
        const key = serverConfig.REDIS_COUNTER_KEY;

        // Check if the Redis client is connected, if not, connect it
        if(!redisClient.isOpen) {
            await redisClient.connect();
        }
        // Increment the counter in Redis and return the new value
        const result = await redisClient.incr(key);
        return result;
    }


    // Set a URL mapping in Redis
    // This method takes a short URL and the corresponding original URL as parameters
    // It stores the mapping in Redis with an expiration time of 24 hours (86400 seconds)
    // The key for the mapping is constructed as "url:{shortUrl}" to ensure uniqueness and easy retrieval
    async setUrlMapping(shortUrl: string, originalUrl: string) {
        const key = `url:${shortUrl}`;
        if(!redisClient.isOpen) {
            await redisClient.connect();
        }

        await redisClient.set(key, originalUrl, { EX: 86400 });
        return;
    }

    // Get the original URL for a given short URL from Redis
    // This method takes a short URL as a parameter and retrieves the corresponding original URL from Redis
    // It constructs the key as "url:{shortUrl}" to look up the mapping
    // If the mapping exists, it returns the original URL; otherwise, it returns null
    async getUrlMapping(shortUrl: string) : Promise<string | null> {
        const key = `url:${shortUrl}`;
        if(!redisClient.isOpen) {
            await redisClient.connect();
        }

        const result = await redisClient.get(key);
        return result;
    }


    
    // Delete a URL mapping from Redis
    // This method takes a short URL as a parameter and deletes the corresponding mapping from Redis
    // It constructs the key as "url:{shortUrl}" to identify the mapping to be deleted
    // After deletion, it returns without any value
    async deleteUrlMapping(shortUrl: string) {
        const key = `url:${shortUrl}`;
        if(!redisClient.isOpen) {
            await redisClient.connect();
        }

        await redisClient.del(key);
        return;
    }
}