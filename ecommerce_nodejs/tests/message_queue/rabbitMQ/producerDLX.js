const amqp = require('amqplib')
const messages = "hello amerikaya"

const runProducerDLX = async() => {
    try {
        
        // 1. create connection
        const conn = await amqp.connect('amqp://guest:12345@localhost')
        

        // 2. create channel
        const channel = await conn.createChannel();

        // 3. declare name exchange, queue, routing key
        const notificationExchange = 'notificationExchange'; // exchange direct
        const notificationQueue = 'notificationQueueProcess'; // queue
        const notificationExchangeDLX = 'notificationExchangeDLX'; // DLX exchange direct
        const notificationRoutingKeyDLX = 'notificationRoutingKey' // routing key direct

        // 4. create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 5. create queue
        const {queue} = await channel.assertQueue(notificationQueue, {
            durable: true,
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 6. bindQueue
        await channel.bindQueue(queue, notificationExchange)

        // 7. send message
        console.log(queue)
        const isSend = channel.sendToQueue(queue, Buffer.from(messages), {
            expiration: '10000' // 10s
        })
        if (isSend) {
            console.log(`send message:`,messages)
        } else {
            console.log(`chua send`)
        }

        setTimeout(() => {
            conn.close();
            process.exit(0)
        }, 500)


    } catch (error) {
        console.error(`error:`, error.message)
    }
}

runProducerDLX().then(rs => console.log(rs)).catch(err => console.error(err))