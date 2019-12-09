require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const dotenv = require('dotenv')

const token = process.env.botToken
/*
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
*/

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong')
  }
})
client.login(token)
