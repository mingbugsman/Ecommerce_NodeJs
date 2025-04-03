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
module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest
}