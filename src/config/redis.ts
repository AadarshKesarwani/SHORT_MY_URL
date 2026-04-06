import {createClient} from 'redis';
import {serverConfig} from './index';


export const redisClient = createClient({
    url: serverConfig.REDIS_URI
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
    process.exit(1); // Exit the process with an error code
});

redisClient.on('connect', () => {
    console.log(`Connected to Redis at ${serverConfig.REDIS_URI}`);
});

export async function initRedis() {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        process.exit(1); // Exit the process with an error code
    }
}

export async function disconnectRedis() {
    try {
        await redisClient.quit();
        console.log('Disconnected from Redis');
    } catch (err) {
        console.error('Failed to disconnect from Redis:', err);
    }
}