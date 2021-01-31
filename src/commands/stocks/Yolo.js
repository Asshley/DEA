const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Yolo extends Command {
  constructor() {
    super({
      names: ['yolo'],
      groupName: 'stocks',
      description: 'Buy shares in a stock of your choosing.',
      args: [
        new Argument({
          name: 'ticker',
          key: 'ticker',
          type: 'string',
          example: 'gme'
        })
      ]
    });
  }

  async run(msg, args) {
    const lower = args.ticker.toLowerCase();
    const stock = await msg._client.tradingView.getTicker(lower).catch(() => null);

    if (!stock) {
      return msg.createErrorReply(`the stock \`${lower}\` doesn't exist.`);
    }

    const value = NumberUtil.fromValue(stock.lp || stock.bid);
    const maximum = Math.floor(msg.dbUser.cash / value);

    if (maximum <= 0) {
      return msg.createErrorReply('you don\'t have enough money for a single share of this stock, \
      you are broke, quit trying to yolo.');
    }

    const price = value * maximum;
    const shares = `portfolio.${lower}.shares`;
    const spent = `portfolio.${lower}.spent`;

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: {
        [shares]: maximum, cash: -price, [spent]: price
      }
    });

    return msg.createReply(`you've successfully bought ${maximum} shares of \
${stock.short_name} for ${NumberUtil.format(price)}`);
  }
}

module.exports = new Yolo();
