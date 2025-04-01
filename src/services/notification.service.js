'use strict'

const notificationModel = require("../models/notification.model")


class NotificationService {
    static async pushNotification({
        type = 'SHOP-001',
        receivedId = 1,
        senderId = 1,
        options = {}
    }) {
        let noti_content 

        if (type === 'SHOP-001') {
            noti_content = 'new product'
        } else if (type = 'VOUCHER-001') {
            noti_content = 'new voucher'
        }

        const newNotification = await notificationModel.create({
            noti_content : noti_content,
            noti_options : options,
            noti_type : type,
            noti_senderId : senderId,
            noti_receivedId: receivedId
        })
        return newNotification;
    }
}

module.exports = NotificationService