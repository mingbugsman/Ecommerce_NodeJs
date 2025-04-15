'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        if (!connection) {
            throw new Error('connection not established')
        }

        const channel = await connection.createChannel()
        return {channel, connection}
    } catch (error) {
        console.error('error connecting to rabbitmq', error);
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const {channel, connection} = await connectToRabbitMQ();

        // Publish message to a queue
        const queue = 'test-queue'
        const message = 'hallo amerika'

        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        await connection.close()
    } catch (error) {
        console.error(`error connecting to RabbitMQ`, error)
    }
}



const consumerQueue = async (chanel, queueName) => {
    try {
        await chanel.assertQueue(queueName, {
            durable: true
        });

        console.log("waiting for messages...");
        chanel.consume(queueName, msg => {
            console.log(`received message: ${queueName}: ${msg.content.toString()}`)
            // 1. find users following shop
            // 2. send message to use
            // 3. if done, => success
            // 4. else error => setup DLX...

        }, {
            noAck: true
        })

    } catch (error) {
        console.log(`Error publish message to rabbitMQ ${error.message}`)
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}