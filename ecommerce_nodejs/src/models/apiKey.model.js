'use strict'

const {model,Schema} = require('mongoose');


const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

const ApiKeySchema = new Schema({
    key : {
        type :String,
        required : true,
        unique : true
    },
    status : { // trạng thái key có hoạt động hay không ?
        type : Boolean,
        default : true 
    },
    permissions : { // vai trò 
        type : [String],
        required : true,
        enum : ['0000','1111','2222']
    }
}, {
    timestamps : true,
    collection : COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME,ApiKeySchema);