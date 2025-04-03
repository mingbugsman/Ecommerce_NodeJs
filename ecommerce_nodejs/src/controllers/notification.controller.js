'use strict'

const { SuccessResponse } = require("../middleware/core/success.response")
const NotificationService = require("../services/notification.service")


class NotificationController {
    listNotificationByUser = async (req, res ,next) => {
        new SuccessResponse({
            message: "Successfully get list notications by user",
            metadata: await NotificationService.listNotificationByUser(req.body)
        }).send(res)
    }
}

module.exports = new NotificationController();