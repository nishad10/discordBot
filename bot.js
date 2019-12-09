const Discord = require('discord.js')
const client = new Discord.Client()
const dotenv = require('dotenv')
const priceData = require('./functions')
const axios = require('axios')
const ramda = require('ramda')
const token = process.env.botToken
/*
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
*/
const {
  priceTemplateBittrex,
  priceTemplateVCC,
  priceTemplateUpbit,
  priceTemplateFinexbox
} = priceData
client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.channel.send('pong')
  }
})

client.on('message', msg => {
  if (msg.content === '!mcap') {
    let config = {
      headers: {
        ['X-CMC_PRO_API_KEY']: process.env.coinMarketCapKey
      }
    }
    axios
      .all([
        axios.get(
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=RADS',
          config
        ),
        axios.get(
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC',
          config
        )
      ])
      .then(
        axios.spread((mcap, btc) => {
          msg.channel.send(
            `***$${Math.round(
              mcap.data.data.RADS.quote.USD.market_cap
            ).toLocaleString()} | ${parseFloat(
              mcap.data.data.RADS.quote.USD.market_cap /
                btc.data.data.BTC.quote.USD.price
            ).toFixed(2)} BTC***`
          )
        })
      )
      .catch(error => console.log(error))
  }
})
client.on('message', msg => {
  if (msg.content === '!help') {
    msg.channel.send(
      '```yaml\n !price - Latest price/information of RADS exchanges.\n !mcap - To get the market capitalization of RADS```'
    )
  }
})

client.on('message', msg => {
  if (
    msg.content === '!price' ||
    msg.content === '!exchanges' ||
    msg.content === '!listings' ||
    msg.content === '!market'
  ) {
    axios
      .all([
        axios.get(
          'https://api.bittrex.com/api/v1.1/public/getmarketsummary?market=btc-rads'
        ), //bittrex with param
        axios.get(
          'https://api.bittrex.com/api/v1.1/public/getmarketsummary?market=USD-BTC'
        ),
        axios.get(`https://vcc.exchange/api/v2/summary`), // vcc without param
        axios.get('https://api.upbit.com/v1/ticker?markets=BTC-RADS'), //upbit with param
        axios.get('https://api.upbit.com/v1/ticker?markets=USDT-BTC'), //upbit with param
        axios.get('https://xapi.finexbox.com/v1/market') // finebox without param
      ])
      .then(
        axios.spread(
          (bittrex, bittrexBTCData, vcc, upbit, upbitBTCData, finebox) => {
            const bittrexData = bittrex.data.success
              ? bittrex.data.result[0]
              : {}
            const bittrexBTC = bittrexBTCData.data.success
              ? bittrexBTCData.data.result[0].Last
              : 0
            const vccData = ramda.isNil(ramda.prop('rads_btc', vcc.data.data))
              ? {}
              : ramda.prop('rads_btc', vcc.data.data)
            const vccBTC = ramda.isNil(ramda.prop('btc_usdt', vcc.data.data))
              ? 0
              : ramda.prop('btc_usdt', vcc.data.data).last
            const upbitData = upbit.data[0]
            const upbitBTC = upbitBTCData.data[0].trade_price
            const fineboxID = ramda.findIndex(
              ramda.propEq('market', 'RADS_BTC')
            )(finebox.data.result)
            const fineboxData = ramda.isNil(finebox.data.result[fineboxID])
              ? {}
              : finebox.data.result[fineboxID]
            const embed = {
              description: `[BITTREX](https://bittrex.com/Market/Index?MarketName=BTC-RADS)${priceTemplateBittrex(
                'Bittrex',
                bittrexData,
                bittrexBTC
              )}
                  \n[VCC](https://vcc.exchange/exchange/basic?currency=btc&coin=rads)${priceTemplateVCC(
                    'VCC',
                    vccData,
                    vccBTC
                  )}
                  \n[UPbit](https://upbit.com/exchange?code=CRIX.UPBIT.BTC-RADS)${priceTemplateUpbit(
                    'Upbit',
                    upbitData,
                    upbitBTC
                  )}
                  \n[FINEXBOX](https://www.finexbox.com/market/pair/RADS-BTC.html)${priceTemplateFinexbox(
                    'Finexbox',
                    fineboxData
                  )}`,
              color: 4405442
            }
            msg.channel.send('', { embed })
          }
        )
      )
      .catch(error => console.log(error))
  }
})

client.login(token)
