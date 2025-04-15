"use strict";
const amqp = require('amqplib')

/////// ordered
async function consumerOrderMessage() {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const queueName = "ordered-queued-message";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // set prefetch to 1 to ensure only one ack at a time
    await channel.prefetch(1)

    channel.consume(queueName, msg => {
        const message = msg.content.toString();

        setTimeout(() => {
            console.log('processed:',message)
            channel.ack(msg)
        },Math.random()*1000)
    })

  } catch (error) {
    console.error(error);
  }
}

consumerOrderMessage().catch((err) => console.log(err));
