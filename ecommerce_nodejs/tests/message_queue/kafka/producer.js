const {Kafka, logLevel} = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.NOTHING
})

const producer = kafka.producer();

const runProducer = async () => {
    await producer.connect()
    await producer.send({
        topic : 'test-topic',
        messages : [
            {value: 'Hallo :D'},
        ],
    })
}

runProducer().catch(err => console.log(err))