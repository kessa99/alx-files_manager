const redis = require('redis');
import { promisify } from 'util';

// redis class
class RedisClient {
// redis client
    constructor() {
        this.client = redis.createClient();

        this.isClientconnected = true;

        // display any redis client must be displayed in the console
        this.client.on('error', (err) => {
            console.error('Redis client failed to connect:', err.message || err.toString());
        });

        this.client.on('ready', () => {
            console.log('Redis client is ready');
            this.isClientconnected = true;
        });

        this.client.on('end', () => {
            console.log('Redis client disconnected');
            this.isClientconnected = false;
        });

        this.client.connect().catch((err) => {
            console.error('Redis client failed to connect:', err.message || err.toString());
        });
    }

    // function isAlive that returns true if the client is connected to the server, otherwise false
    async isAlive() {
        return this.isClientconnected;
    }

    // an asynchronous function get that takes a string key as argument and returns the redis value stored for this key
    async get(key) {
        if (!this.isClientconnected) {
            throw new Error('Redis client is not connected to the server');
        }
        return promisify(this.client.get).bind(this.client)(key);
    }

    // an asynchronous function set that takes a string key a value and duration in second as arguments
    // to store it in redis(with an expiration set by duration argument)
    async set(key, value, duration){
        if (!this.isClientconnected) {
            throw new Error('Redis client is not connected to the server');
        }
        return promisify(this.client.setex).bind(this.client)(key, duration, value);
    }

    // an asynchronous function del that takes a string key as argument and remove the value in redis for this key
    async del(key) {
        if (!this.isClientconnected) {
            throw new Error('Redis client is not connected to the server');
        }
        return promisify(this.client.del).bind(this.client)(key);
    }
}

// export the RedisClient class
const redisClient = new RedisClient();
module.exports = redisClient;