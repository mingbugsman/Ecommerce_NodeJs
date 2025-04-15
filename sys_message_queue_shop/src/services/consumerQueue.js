const { 
    consumerQueue, connectToRabbitMQ
} = require('../dbs/init.rabbit')
const log = console.log;

console.log  = function() {
    log.apply(console, [new Date()].concat(arguments))
}

class MessageService  {
    async consumerToQueue(queueName) {
        try {
            const {channel, connection} = await connectToRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error(`Error consumer to queue`, error)
        }
    }

    async consumerToQueueNormal() {
        try {
            const {channel, connection} = await connectToRabbitMQ();
            
            const notificationQueue = 'notificationQueueProcess'

            const timeExpired = 15000;
            console.log(`thoi gian tien trinh la 8000`);
            setTimeout(() => {
                console.log(`thuc hinh nhan message`)
                channel.consume(notificationQueue, msg => {
                    console.log(`SEND notificationQueue successfully processed:`, msg.content.toString())
                    channel.ack(msg)
                })
            }, timeExpired)

        } catch (error) {
            console.error(`Error consumer to queue`, error.message)
        }
    }

    async consumerToQueueFailed() {
        try {

            const {channel, connection} = await connectToRabbitMQ();
            const notificationExchangeDLX = 'notificationExchangeDLX'; // DLX exchange direct
            const notificationRoutingKeyDLX = 'notificationRoutingKey' // routing key direct
            const notificationHotFix = 'notificationQueueHotFix';

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            })

            const {queue} = await channel.assertQueue(notificationHotFix, {
                exclusive: false
            })

            await channel.bindQueue(queue, notificationExchangeDLX, notificationRoutingKeyDLX);
            await channel.consume(queue, msg => {
                const fixed = msg.content.toString()
                console.log(`this notification error, pls hot fix::`, fixed)
                
                channel.sendToQueue(queue, Buffer.from(fixed))
            }, {
                noAck: false
            })
            

        } catch (error) {
            console.error(`Error consumer to queue`, error)
        }
    }
}


module.exports = new MessageService();