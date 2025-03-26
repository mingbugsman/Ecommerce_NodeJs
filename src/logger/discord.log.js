'use strict'
const {Client, GatewayIntentBits} = require('discord.js')
const {
    CHANNELID_DISCORD,
    TOKEN_DISCORD
} = process.env

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })
        // add channelId
        this.channelId = CHANNELID_DISCORD
        this.client.on('ready', () => {
            console.log(`Logged is as ${this.client.user.tag}`)
        })
        this.client.login(TOKEN_DISCORD)
    }

    sendToFormatCode(logData) {
        const {code, message = 'This is some additional information about code.',
            title ='Code Example'
        } = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00',16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage)
    }


    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId)
        if (!channel) {
            console.error(`Couldn't find the channel...`, this.channelId)
        }
        channel.send(message).catch(e => console.error(e))
    }
}
module.exports = new LoggerService();