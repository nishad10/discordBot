exports.priceTemplateBittrex = (name, data, btc) =>
  ` : ${parseFloat(data.Last).toFixed(8)} BTC **|** $${parseFloat(
    data.Last * btc
  ).toFixed(2)}
**Vol:** ${Math.round(data.Volume)} RADS **|** ${(
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
**Vol:** ${Math.round(data.baseVolume)} RADS **|** ${(
    parseFloat(data.last).toFixed(8) * Math.round(data.baseVolume)
  ).toFixed(2)} BTC **|** ${Math.round(data.baseVolume * data.last * btc)} USD
**Low:** ${parseFloat(data.low24hr).toFixed(8)} **|** **High:** ${parseFloat(
    data.high24hr
  ).toFixed(8)}
**24h change:** ${parseFloat(data.percentChange).toFixed(2)}% ${
    parseFloat(data.percentChange).toFixed(2) >= 0 ? ' ⬆️' : ' ⬇️'
  }`;

exports.priceTemplateUpbit = (name, data, btc) =>
  ` : ${parseFloat(data.trade_price).toFixed(8)} BTC **|** $${parseFloat(
    data.trade_price * btc
  ).toFixed(2)}
**Vol:** ${Math.round(data.trade_volume)} RADS **|** ${(
    parseFloat(data.trade_price).toFixed(8) * Math.round(data.trade_volume)
  ).toFixed(2)} BTC **|** ${Math.round(
    data.trade_volume * data.trade_price * btc
  )} USD
**Low:** ${parseFloat(data.low_price).toFixed(8)} **|** **High:** ${parseFloat(
    data.high_price
  ).toFixed(8)}
**24h change:** ${parseFloat(
    Math.round(
      100 *
        Math.abs(
          (data.trade_price - data.prev_closing_price) /
            ((data.trade_price + data.prev_closing_price) / 2)
        )
    )
  ).toFixed(2)}% ${
    parseFloat(
      Math.round(
        100 *
          Math.abs(
            (data.trade_price - data.prev_closing_price) /
              ((data.trade_price + data.prev_closing_price) / 2)
          )
      )
    ).toFixed(2) >= 0
      ? ' ⬆️'
      : ' ⬇️'
  }`;

exports.priceTemplateFinexbox = (name, data, btc) =>
  ` : ${parseFloat(data.price).toFixed(8)} BTC **|** $${parseFloat(
    data.price * btc
  ).toFixed(2)}
**Vol:** ${Math.round(data.volume)} RADS **|** ${(
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
**Vol:** ${Math.round(data.volume)} RADS **|** ${(
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
