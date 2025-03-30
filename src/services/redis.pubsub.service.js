const Redis = require('redis')

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient();
        this.publisher = Redis.createClient();
        this.subscriber.connect();
        this.publisher.connect();
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                console.log(`channel: ${channel}, message: ${message}`)
                if (err) reject(err)
                else resolve(reply)
            })
        })
    }

    async subscribe(channel, callback) {
        await this.subscriber.subscribe(channel, (subscribeChannel, message) => {
            console.log(`Received message from ${channel}: ${message}`)
            if (channel === subscribeChannel) {
                callback(channel, message)
            }   
        })
        console.log(`Subscribed to channel: ${channel}`);
    }
}


module.exports = new RedisPubSubService()