'use strict'
const amqp = require('amqplib')



async function producerOrderedMessage(params) {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message'
    await channel.assertQueue(queueName, {
        durable: true
    })

    for (let i = 0 ; i < 10; i++) {
        const message = 'order-queued-message::' + i;
        console.log(message);
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        })
    }

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 1000)
}

producerOrderedMessage().catch(err => console.log(err));