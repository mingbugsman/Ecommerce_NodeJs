'use strict'
const { Client, GatewayIntentBits } = require('discord.js')
const OpenAI = require('openai')

const openai = new OpenAI()

class ChatGPTBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })
        this.channelId = process.env.CHANNELID_DISCORD
        this.isReady = false

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return // skip all messages from other bots
            if (!message.content.startsWith('!ask')) return 

            const userQuestion = message.content.replace('!ask', '').trim()
            if (!userQuestion) {
                message.reply('Hãy nhập câu hỏi sau lệnh `!ask`!')
                return
            }


            const response = await this.askChatGPT(userQuestion)

            
            message.reply({
                embeds: [
                    {
                        color: parseInt('3498db', 16),
                        title: 'ChatGPT Response',
                        description: response
                    }
                ]
            })
        })

        this.client.login(process.env.TOKEN_DISCORD).catch(err => {
            console.error('❌ Lỗi khi đăng nhập bot Discord:', err)
        })
    }

    async askChatGPT(question) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: question }]
            })
            return response.choices[0].message.content
        } catch (error) {
            console.error('Error when call api OPENAI:', error)
            return 'Sorry, i cannot response your question now.'
        }
    }
}

module.exports = new ChatGPTBot()
