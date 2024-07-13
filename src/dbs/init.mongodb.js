// su dung singleton
// cach ket noi su dung class chi ket noi 1 lan duy nhat va ko tao them ket noi nao nua
const mongoose = require('mongoose');
const { db : {host,name,port} } = require('../config/config.mongodb');
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color : true});
        }       
        mongoose.connect(connectString, {maxPoolSize : 50})
        .then(_ => console.log(`connect mongodb success with db name ${name}`))
        .catch(err => console.log(`error connect !`));
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
} 
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;

