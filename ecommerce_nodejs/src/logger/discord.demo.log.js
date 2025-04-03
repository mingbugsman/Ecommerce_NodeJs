'use strict'

const {Client, GatewayIntentBits} = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logged is as ${client.user.tag}`)
})

const token = "YOUR_TOKEN"
client.login(token);

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content === 'hello') {
        msg.reply(`Hello! How can i assist you today!`)
    }
})