const redis = require('redis');
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        this.isClientConnected = true;

        this.client.on('error', (err) => {
            console.error('Redis client failed to connect:', err.message || err.toString());
            this.isClientConnected = false;
        });

        this.client.on('ready', () => {
            console.log('Redis client connected');
            this.isClientConnected = true;
        });

        this.client.on('end', () => {
            console.log('Redis client disconnected');
            this.isClientConnected = false;
        });
    }

    isAlive() {
        return this.isClientConnected;
    }

    async get(key) {
        if (!this.isClientConnected) {
            console.error('Redis client is not connected to the server');
            return null;
        }
        const getAsync = promisify(this.client.get).bind(this.client);
        return getAsync(key);
    }

    async set(key, value, duration) {
        if (!this.isClientConnected) {
            console.error('Redis client is not connected to the server');
            return null;
        }
        const setExAsync = promisify(this.client.setex).bind(this.client);
        return setExAsync(key, duration, value);
    }

    async del(key) {
        if (!this.isClientConnected) {
            console.error('Redis client is not connected to the server');
            return null;
        }
        const delAsync = promisify(this.client.del).bind(this.client);
        return delAsync(key);
    }
}

const redisClient = new RedisClient();
export default redisClient;
