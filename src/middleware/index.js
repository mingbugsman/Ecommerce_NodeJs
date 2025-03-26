'use strict'

const Logger = require('../logger/discord.log')
const ChatGPT = require('../logger/discord.chatgpt')
const pustToLogDiscord = async (req,res,next) => {
    try {
        Logger.sendToFormatCode({
            title : `METHOD: ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body ,
            message: `${req.get('host')}${req.originalUrl}`
        })
        return next()
    } catch (error) {
        next(error)
    }
}
/*
const askChatGPT = async (req,res,next) => {
    try {
        ChatGPT.askChatGPT(req.body)
        return next()
    } catch (error) {
        next(error)
    }
}*/

module.exports = {
    pustToLogDiscord,
}