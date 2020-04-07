const Discord = require('discord.js')
const client = new Discord.Client()
const dotenv = require('dotenv')
const priceData = require('./functions')
const axios = require('axios')
const ramda = require('ramda')

const httpClient = axios.create()
httpClient.defaults.timeout = 5000

const token = process.env.botToken
const logChannel = process.env.logChannel
const whiteListGuilds = ['339068670372478976', '568890299028471809'] // dev personal , radium dev/management, radium public.
/*
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
*/
function useNull() {
  return undefined
}

const {
  priceTemplateBittrex,
  priceTemplateVCC,
  priceTemplateUpbit,
  priceTemplateFinexbox
} = priceData

const config = {
  headers: {
    ['X-CMC_PRO_API_KEY']: process.env.coinMarketCapKey
  }
}
client.on('message', msg => {
  if (msg.content.startsWith('!'))
    console.log(
      `\x1b[36m Requested by ID: \x1b[0m${msg.author
        .id}, \x1b[36m Alias Username: \x1b[0m${msg.author.username} ${msg.guild
        ? `\x1b[36m Group chat: True`
        : `\x1b[36m Group chat: False`}
      \x1b[36m Msg Txt: \x1b[0m${msg.content}`
    )
})

// This is for timestamp of joining date if we need it for banning people based on recent join (raid)
//msg.member.joinedTimestamp

client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.channel.send('pong')
  }
})

client.on('message', msg => {
  if (msg.content === '!mcap') {
    axios
      .all([
        httpClient.get(
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=RADS',
          config
        ),
        httpClient.get(
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC',
          config
        )
      ])
      .then(
        axios.spread((mcap, btc) => {
          msg.channel.send(
            `**$${Math.round(
              mcap.data.data.RADS.quote.USD.market_cap
            ).toLocaleString()} | ${parseFloat(
              mcap.data.data.RADS.quote.USD.market_cap /
                btc.data.data.BTC.quote.USD.price
            ).toFixed(2)} BTC**`
          )
        })
      )
      .catch(error => console.log(error))
  }
})
client.on('message', msg => {
  if (msg.content === '!help') {
    msg.channel.send(
      '```\n !price - Latest price/information of RADS exchanges.\n !mcap  - To get the market capitalization of RADS```'
    )
  }
})

client.on('message', msg => {
  if (msg.content === '!mod') {
    if (msg.member.hasPermission('KICK_MEMBERS', false, false)) {
      msg.channel.send(
        '```\n!kick - Followed by this command give me a list of users to kick, make sure you @mention them. Example !kick @radiumBot\n\n!ban - Followed by this command give me a list of users to ban, make sure you @mention them. Example !ban @radiumBot```'
      )
    } else {
      console.log('ERROR user without permissions tried !mod command')
    }
  }
})
let vccBTC = 0
let vccData = 0
let bittrexData = 0
let bittrexBTC = 0
let upbitBTC = 0
let upbitData = 0
let fineboxData = 0
let coinMarketCapBTC = 0
client.on('message', msg => {
  const save = msg
  if (
    msg.content === '!price' ||
    msg.content === '!exchanges' ||
    msg.content === '!listings' ||
    msg.content === '!market'
  ) {
    axios
      .all([
        httpClient
          .get(
            'https://api.bittrex.com/api/v1.1/public/getmarketsummary?market=btc-rads'
          )
          .catch(useNull),
        httpClient
          .get(
            'https://api.bittrex.com/api/v1.1/public/getmarketsummary?market=USD-BTC'
          )
          .catch(useNull),
        httpClient.get(`https://vcc.exchange/api/v2/summary`).catch(useNull),
        httpClient
          .get('https://api.upbit.com/v1/ticker?markets=BTC-RADS')
          .catch(useNull),
        httpClient
          .get('https://api.upbit.com/v1/ticker?markets=USDT-BTC')
          .catch(useNull),
        httpClient.get('https://xapi.finexbox.com/v1/market').catch(useNull),
        httpClient
          .get(
            'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC',
            config
          )
          .catch(useNull)
      ])
      .then(
        axios.spread(
          (
            bittrex,
            bittrexBTCData,
            vcc,
            upbit,
            upbitBTCData,
            finebox,
            coinMarketCapBTCData
          ) => {
            if (!ramda.isNil(bittrex) && !ramda.isNil(bittrexBTCData)) {
              bittrexData = bittrex.data.success ? bittrex.data.result[0] : {}
              bittrexBTC = bittrexBTCData.data.success
                ? bittrexBTCData.data.result[0].Last
                : 0
            }
            if (!ramda.isNil(vcc)) {
              vccData = ramda.isNil(ramda.prop('rads_btc', vcc.data.data))
                ? {}
                : ramda.prop('rads_btc', vcc.data.data)
              vccBTC = ramda.isNil(ramda.prop('btc_usdt', vcc.data.data))
                ? 0
                : ramda.prop('btc_usdt', vcc.data.data).last
            }
            if (!ramda.isNil(upbit) && !ramda.isNil(upbitBTCData)) {
              upbitData = upbit.data[0]
              upbitBTC = upbitBTCData.data[0].trade_price
            }
            /*if (!ramda.isNil(finebox) && !ramda.isNil(coinMarketCapBTCData)) {
              fineboxID = ramda.findIndex(ramda.propEq('market', 'RADS_BTC'))(
                finebox.data.result
              )
              fineboxData = finebox.data.result[fineboxID]

              coinMarketCapBTC =
                coinMarketCapBTCData.data.data.BTC.quote.USD.price
            }*/ // Finebox unlisted so temp remove.
            const embed = {
              description: `${!ramda.isNil(bittrex)
                ? `[BITTREX](https://bittrex.com/Market/Index?MarketName=BTC-RADS)${priceTemplateBittrex(
                    'Bittrex',
                    bittrexData,
                    bittrexBTC
                  )}`
                : '\n[BITTREX](https://bittrex.com/Market/Index?MarketName=BTC-RADS) servers are down.'}
              ${!ramda.isNil(vcc)
                ? `\n[VCC](https://vcc.exchange/exchange/basic?currency=btc&coin=rads)${priceTemplateVCC(
                    'VCC',
                    vccData,
                    vccBTC
                  )}`
                : '\n[VCC](https://vcc.exchange/exchange/basic?currency=btc&coin=rads) servers are down.'}
                  ${!ramda.isNil(upbit)
                    ? `\n[UPbit](https://upbit.com/exchange?code=CRIX.UPBIT.BTC-RADS)${priceTemplateUpbit(
                        'Upbit',
                        upbitData,
                        upbitBTC
                      )}`
                    : '\n[UPbit](https://upbit.com/exchange?code=CRIX.UPBIT.BTC-RADS) Servers are down.'}`,
              color: 4405442
            }
            msg.channel.send('', { embed })
            /*
            ${!ramda.isNil(finebox)
                    ? `\n[FINEXBOX](https://www.finexbox.com/market/pair/RADS-BTC.html)${priceTemplateFinexbox(
                        'Finexbox',
                        fineboxData,
                        coinMarketCapBTC
                      )}`
                    : '\n[FINEXBOX](https://www.finexbox.com/market/pair/RADS-BTC.html) Servers are down!'}
                    */
          }
        )
      )
      .catch(error => {
        console.log('ERROR while getting PRICE VALUES', error)
        save.channel.send(
          `Hey ${save.author
            .username} looks like something went wrong, try again after some time, this should not happen.`
        )
      })
  }
})

client.on('message', message => {
  if (!message.guild)
    // Ignore messages that aren't from a guild
    return

  // If the message content starts with "!kick"
  if (message.content.startsWith('!kick')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions

    if (message.member.hasPermission('KICK_MEMBERS', false, false)) {
      if (message.mentions.users.first()) {
        Array.from(message.mentions.users, ([key, value]) => {
          const user = value
          // const user = message.mentions.users.first()
          // If we have a user mentioned

          // Exclude bot from kicking itself to avoid circular
          if (user.id !== '653386053356617768') {
            // Now we get the member from the user
            const member = message.guild.member(user)
            // If the member is in the guild
            if (member && user.id !== `653386053356617768`) {
              /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
              member
                .kick('Kicked by bot using command.')
                .then(() => {
                  // We let the message author know we were able to kick the person
                  ramda.contains(message.guild.id, whiteListGuilds)
                    ? client.channels
                        .get(logChannel)
                        .send(
                          `id:${message.author.id},username:${message.author
                            .username}issued command and successfully kicked ${user.tag} at ${new Date().toLocaleDateString()}`
                        )
                    : message.channel.send(
                        `id:${message.author.id},username:${message.author
                          .username}issued command and successfully kicked ${user.tag} at ${new Date().toLocaleDateString()}`
                      )
                })
                .catch(err => {
                  // An error happened
                  // This is generally due to the bot not being able to kick the member,
                  // either due to missing permissions or role hierarchy
                  ramda.contains(message.guild.id, whiteListGuilds)
                    ? client.channels
                        .get(logChannel)
                        .send(
                          `${message.author
                            .username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} this might be because I dont have permissions.`
                        )
                    : message.channel.send(
                        `${message.author
                          .username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} this might be because I dont have permissions.`
                      )
                  // Log the error
                  console.error('BOT couldnt KICK maybe permission error.', err)
                })
            } else {
              // The mentioned user isn't in this guild
              ramda.contains(message.guild.id, whiteListGuilds)
                ? client.channels
                    .get(logChannel)
                    .send(
                      `${message.author
                        .username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} this might be because user doesnt exist in server.`
                    )
                : message.channel.send(
                    `${message.author
                      .username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} this might be because user doesnt exist in server.`
                  )
            }
            // Otherwise, if no user was mentioned
          } else {
            ramda.contains(message.guild.id, whiteListGuilds)
              ? client.channels
                  .get(logChannel)
                  .send(
                    `${message.author
                      .username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} you cannot kick me using commands.`
                  )
              : message.channel.send(
                  `${message.author
                    .username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} you cannot kick me using commands.`
                )
          }
        })
      } else {
        ramda.contains(message.guild.id, whiteListGuilds)
          ? client.channels
              .get(logChannel)
              .send(
                `${message.author
                  .username} issued ${message.content}. ERROR: Unable to kick this might be because you didnt specify users to kick`
              )
          : message.channel.send(
              `${message.author
                .username} issued ${message.content}. ERROR: Unable to kick this might be because you didnt specify users to kick`
            )
      }
    } else {
      console.error(
        `${message.author
          .username} issued ${message.content}. ERROR: You dont have permission to do this.`
      )
    }
  }
})

client.on('message', message => {
  if (!message.guild)
    // Ignore messages that aren't from a guild
    return

  // if the message content starts with "!ban"
  if (message.content.startsWith('!ban')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions

    if (message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
      if (message.mentions.users.first()) {
        Array.from(message.mentions.users, ([key, value]) => {
          const user = value
          // If we have a user mentioned
          if (user.id !== '653386053356617768') {
            // Now we get the member from the user
            const member = message.guild.member(user)
            // If the member is in the guild
            if (member) {
              /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         * Read more about what ban options there are over at
         * https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=ban
         */
              member
                .ban({
                  reason: 'They were bad!'
                })
                .then(() => {
                  // We let the message author know we were able to ban the person
                  ramda.contains(message.guild.id, whiteListGuilds)
                    ? client.channels
                        .get(logChannel)
                        .send(
                          `id:${message.author.id},username:${message.author
                            .username}issued command and successfully banned ${user.tag} at ${new Date().toLocaleDateString()}`
                        )
                    : message.channel.send(
                        `id:${message.author.id},username:${message.author
                          .username}issued command and successfully banned ${user.tag} at ${new Date().toLocaleDateString()}`
                      )
                })
                .catch(err => {
                  // An error happened
                  // This is generally due to the bot not being able to ban the member,
                  // either due to missing permissions or role hierarchy
                  ramda.contains(message.guild.id, whiteListGuilds)
                    ? client.channels
                        .get(logChannel)
                        .send(
                          `${message.author
                            .username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} this might be because I dont have permissions.`
                        )
                    : message.channel.send(
                        `${message.author
                          .username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} this might be because I dont have permissions.`
                      )
                  // Log the error
                  console.error('BOT couldnt BAN maybe permission error.', err)
                })
            } else {
              // The mentioned user isn't in this guild
              ramda.contains(message.guild.id, whiteListGuilds)
                ? client.channels
                    .get(logChannel)
                    .send(
                      `${message.author
                        .username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} this might be because user doesnt exist in server.`
                    )
                : message.channel.send(
                    `${message.author
                      .username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} this might be because user doesnt exist in server.`
                  )
            }
          } else {
            // Otherwise, if no user was mentioned
            ramda.contains(message.guild.id, whiteListGuilds)
              ? client.channels
                  .get(logChannel)
                  .send(
                    `${message.author
                      .username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} you cannot kick me using commands.`
                  )
              : message.channel.send(
                  `${message.author
                    .username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} you cannot kick me using commands.`
                )
          }
        })
      } else {
        ramda.contains(message.guild.id, whiteListGuilds)
          ? client.channels
              .get(logChannel)
              .send(
                `${message.author
                  .username} issued ${message.content}. ERROR: Unable to BAN this might be because you didnt specify users to kick`
              )
          : message.channel.send(
              `${message.author
                .username} issued ${message.content}. ERROR: Unable to BAN this might be because you didnt specify users to kick`
            )
      }
    } else {
      console.error(
        `${message.author
          .username} issued ${message.content}. ERROR: You dont have permission to do this.`
      )
    }
  }
})
client.on('disconnect', () => {
  console.log(
    `BOT shutting down at ${new Date().toLocaleDateString()} TIME : ${new Date().toLocaleTimeString()}`
  )
})
client.login(token)
