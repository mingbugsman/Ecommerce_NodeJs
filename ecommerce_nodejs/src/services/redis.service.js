'use-strict'

const redis = require('redis');
const  {promisify} = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();


const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setExAysnc = promisify(redisClient.setEx).bind(redisClient);

const acquiredLock = async (productId, quantity, cartId) => {
    const key = `lock_v2025_${productId}`;
    const retryTimes = 10;
    const expiryTime = 3000; // seconds

    for (let i = 0; i < retryTimes; i++) {
        // create a new key
        // whoever hold key then can go to payment
        const result = await setExAysnc(key, expiryTime);
        if (result === 1) {
            // exec with inventory
            const isReversation = await reservationInventory({productId, quantity, cartId})
            if (isReversation.modifiedCount) {
                await pExpire(key, expiryTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));

        }
    }
}

const releaseLock = async keyLock => {
    const deleteAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await deleteAsyncKey(keyLock);
}

module.exports = {
    acquiredLock,
    releaseLock
}