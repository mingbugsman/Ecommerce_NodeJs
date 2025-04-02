const amqp = require('amqplib');

const message = 'Hallo hallo hallo'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send messages to consumer channel
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`message sent:`, message);
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch(err => console.log(err))