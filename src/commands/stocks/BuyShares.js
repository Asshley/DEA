const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class BuyShares extends Command {
  constructor() {
    super({
      names: ['buyshares', 'bs'],
      groupName: 'stocks',
      description: 'Buy shares in a stock of your choosing.',
      args: [
        new Argument({
          name: 'ticker',
          key: 'ticker',
          type: 'string',
          example: 'gme'
        }),
        new Argument({
          name: 'shares',
          key: 'shares',
          type: 'int',
          example: '3',
          preconditions: ['minimum'],
          preconditionOptions: [{ minimum: 1 }]
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

    const price = NumberUtil.fromValue((stock.lp || stock.bid) * args.shares);
    const maximum = Math.floor(msg.dbUser.cash / NumberUtil.fromValue(stock.lp || stock.bid));
    const fmtShares = NumberUtil.display(args.shares);

    if (msg.dbUser.cash < price) {
      const fmtMax = NumberUtil.display(maximum);

      return msg.createReply(`you do not have ${NumberUtil.format(price)} for \
${fmtShares} shares of ${stock.short_name}, the most you can buy is ${fmtMax}.`);
    }

    const shares = `portfolio.${args.ticker}.shares`;
    const spent = `portfolio.${args.ticker}.spent`;

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: {
        [shares]: args.shares, cash: -price, [spent]: price
      }
    });

    return msg.createReply(`you've successfully bought ${fmtShares} shares \
of ${stock.short_name} for ${NumberUtil.format(price)}.`);
  }
}

module.exports = new BuyShares();
