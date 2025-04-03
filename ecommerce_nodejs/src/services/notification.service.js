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

    static async listNotificationByUser({
        userId = 1,
        type = 'ALL',
        isRead = 0
    }) {
        const match = {noti_receivedId: userId};
        if (type !== 'ALL') {
            match['noti_type'] = type;
        }

        return await notificationModel.aggregate([
            {$match : match},
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: 1,
                    noti_options: 1,
                    createAt: 1
                }
            }
        ])
    }
}

module.exports = NotificationService