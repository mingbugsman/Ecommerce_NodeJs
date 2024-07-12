'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 10000;
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`so luong connection ::: ${numConnection}`)
};

// check over load

const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;;
        const memoryUsage = process.memoryUsage().rss;
        // example maximum number of connections based on number osf cores
        console.log('active connection', numConnection);
        console.log(`memory usage ::: ${memoryUsage/1024/1024}MB`)
        const maxConnections = numCores*5;
        if (numConnection > maxConnections) {
            console.log('connection overload detected');
        }
    },_SECONDS) // monitor every 5 seconds
}

module.exports = {
    countConnect,checkOverLoad
}