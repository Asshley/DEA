const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Stock extends Command {
  constructor() {
    super({
      names: ['stocks', 'stock', 'ticker'],
      groupName: 'stocks',
      description: 'View the details of any stock.',
      args: [
        new Argument({
          name: 'ticker',
          key: 'ticker',
          type: 'string',
          example: 'aapl',
          defaultValue: 'gme',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const stock = await msg._client.tradingView.getTicker(args.ticker).catch(() => null);

    if (!stock) {
      return msg.createErrorReply(`the stock \`${args.ticker}\` doesn't exist.`);
    }

    const price = `Price ${NumberUtil.toUSD(NumberUtil.fromValue(stock.lp || stock.bid))}`;
    const change = `Change: ${NumberUtil.toUSD(NumberUtil.fromValue(stock.ch))}`;
    const percentChanged = `(${stock.chp})%`;
    const high = `High: ${NumberUtil.toUSD(NumberUtil.fromValue(stock.high_price))}`;
    const low = `Low: ${NumberUtil.toUSD(NumberUtil.fromValue(stock.low_price))}`;
    const openPrice = `Open Price: ${NumberUtil.toUSD(NumberUtil.fromValue(stock.open_price))}`;
    const prevClosePrice = `Prev Close Price: ${NumberUtil
      .toUSD(NumberUtil.fromValue(stock.prev_close_price))}`;
    const attributes = `Tradable: ${stock.is_tradable}\nFractional: ${stock.fractional}`;
    const format = `${price}\n${change}\n${percentChanged}\n${high}\n${low}
${openPrice}\n${prevClosePrice}\n${attributes}`;
    const options = {
      title: `${stock.description} (${stock.short_name})`,
      footer: { text: `Volume: ${NumberUtil.toUSD(NumberUtil.fromValue(stock.volume))}` }
    };

    return msg.channel.sendMessage(format, options);
  }
}

module.exports = new Stock();
