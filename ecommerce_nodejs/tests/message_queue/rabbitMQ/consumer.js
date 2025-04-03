const amqp = require('amqplib');




const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send messages to consumer channel
        channel.consume(queueName,(message) => {
            console.log(`received ${message.content.toString()}`)
        }, {
            noAck: true
        });
        console.log(`message sent:`, message);
    } catch (error) {
        console.error(error)
    }
}

runConsumer().catch(err => console.log(err))