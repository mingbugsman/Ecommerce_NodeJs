'use strict'
require('dotenv').config()
const MessageService = require("./src/services/consumerQueue");



const queueName = 'test-topic';

/*
MessageService.consumerToQueue(queueName).then(() => {
    console.log(`Message consumer started ${queueName}`)
}).catch(err => {
    console.error(`Message error: ${err.message}`)
})*/

MessageService.consumerToQueueNormal().then((rs) => {
    console.log(`message consumer to queue normal started`)
}).catch(err => {
    console.log(`error roiii`)
})

MessageService.consumerToQueueFailed().then((rs) => {
    console.log(`message consumer to queue failed started`)
}).catch(err => {
    console.log(`error roiii`)
})