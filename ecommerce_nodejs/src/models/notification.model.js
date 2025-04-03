'use strict'

const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

// ORDER-001 : order successfully 
// ORDER-002 : order failed


const notificationSchema = new Schema({
    noti_type: {type: String, enum: ['order-001','order-002', 'VOUCHER-001', 'SHOP-001', 'product-001', 'product-002'],required :true},
    noti_senderId : {type: Schema.Types.ObjectId, required: true, ref: 'Shop'},
    noti_receivedId : {type: Number, required: true},
    noti_content:  {type: String, required: true},
    noti_options:  {type: Object, default: {}},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, notificationSchema);

