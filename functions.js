exports.priceTemplateBittrex = (name, data, btc) =>
  ` : ${parseFloat(data.Last).toFixed(8)} BTC **|** $${parseFloat(
    data.Last * btc
  ).toFixed(2)}
**Vol:** ${Math.round(data.Volume)} VAL **|** ${(
    parseFloat(data.Last).toFixed(8) * Math.round(data.Volume)
  ).toFixed(2)} BTC **|** ${Math.round(data.Volume * data.Last * btc)} USD
**Low:** ${parseFloat(data.Low).toFixed(8)} **|** **High:** ${parseFloat(
    data.High
  ).toFixed(8)}
**24h change:** ${parseFloat(
    Math.round(
      100 *
        Math.abs((data.Last - data.PrevDay) / ((data.Last + data.PrevDay) / 2))
    )
  ).toFixed(2)}% ${
    parseFloat(
      Math.round(
        100 *
          Math.abs(
            (data.Last - data.PrevDay) / ((data.Last + data.PrevDay) / 2)
          )
      )
    ).toFixed(2) >= 0
      ? ' ⬆️'
      : ' ⬇️'
  }`;

exports.priceTemplateVCC = (name, data, btc) =>
  ` : ${parseFloat(data.last).toFixed(8)} BTC **|** $${parseFloat(
    data.last * btc
  ).toFixed(2)}
**Vol:** ${Math.round(data.baseVolume)} VAL **|** ${(
    parseFloat(data.last).toFixed(8) * Math.round(data.baseVolume)
  ).toFixed(2)} BTC **|** ${Math.round(data.baseVolume * data.last * btc)} USD
**Low:** ${parseFloat(data.low24hr).toFixed(8)} **|** **High:** ${parseFloat(
    data.high24hr
  ).toFixed(8)}
**24h change:** ${parseFloat(data.percentChange).toFixed(2)}% ${
    parseFloat(data.percentChange).toFixed(2) >= 0 ? ' ⬆️' : ' ⬇️'
  }`;

exports.priceTemplateUpbit = (name, data, btc, coingeckoData) =>
  ` : ${parseFloat(data.trade_price).toFixed(8)} BTC | $${parseFloat(
    data.trade_price * btc
  ).toFixed(2)}
**Vol:** ${Math.round(
    data.acc_trade_volume +
      coingeckoData.converted_volume.btc *
        parseFloat(data.trade_price).toFixed(8)
  )} VAL **|** ${(
    parseFloat(data.trade_price).toFixed(8) *
      Math.round(data.acc_trade_volume) +
    coingeckoData.converted_volume.btc
  ).toFixed(2)} BTC **|** ${Math.round(
    data.acc_trade_volume * data.trade_price * btc +
      coingeckoData.converted_volume.usd
  )} USD
**Volume Korea:** ${Math.abs(
    parseFloat(data.trade_price).toFixed(8) *
      Math.round(data.acc_trade_volume) +
      coingeckoData.converted_volume.btc -
      coingeckoData.converted_volume.btc
  ).toFixed(2)} BTC 
**Volume Indonesia:** ${coingeckoData.converted_volume.btc.toFixed(2)} BTC
**Low:** ${parseFloat(data.low_price).toFixed(8)} | **High:** ${parseFloat(
    data.high_price
  ).toFixed(8)}
**24h change:** ${parseFloat(data.signed_change_rate * 100).toFixed(2)}% ${
    parseFloat(data.signed_change_rate * 100).toFixed(2) >= 0 ? ' ⬆️' : ' ⬇️'
  }`;

exports.priceTemplateFinexbox = (name, data, btc) =>
  ` : ${parseFloat(data.price).toFixed(8)} BTC **|** $${parseFloat(
    data.price * btc
  ).toFixed(2)}
**Vol:** ${Math.round(data.volume)} VAL **|** ${(
    parseFloat(data.price).toFixed(8) * Math.round(data.volume)
  ).toFixed(2)} BTC **|** ${Math.round(data.volume * data.price * btc)} USD
**Low:** ${parseFloat(data.low).toFixed(8)} **|** **High:** ${parseFloat(
    data.high
  ).toFixed(8)}
**24h change:** N/A`;

exports.priceTemplateLiveCoin = (name, data, btc) =>
  ` : ${parseFloat(data.last).toFixed(8)} BTC **|** $${parseFloat(
    data.last * btc.last
  ).toFixed(2)}
**Vol:** ${Math.round(data.volume)} VAL **|** ${(
    parseFloat(data.last).toFixed(8) * Math.round(data.volume)
  ).toFixed(2)} BTC **|** ${Math.round(data.volume * data.last * btc.last)} USD
**Low:** ${parseFloat(data.low).toFixed(8)} **|** **High:** ${parseFloat(
    data.high
  ).toFixed(8)}
**24h change:** N/A`;

/*
    ${parseFloat(data.percent).toFixed(2)}% ${parseFloat(
    data.percent
  ).toFixed(8) >= 0
    ? ' ⬆️'
    : ' ⬇️'}*/
