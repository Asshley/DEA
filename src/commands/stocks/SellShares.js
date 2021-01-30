const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class SellShares extends Command {
  constructor() {
    super({
      names: [
        'sell',
        'sellshare',
        'sellshares',
        'ss',
        'paperhands'
      ],
      groupName: 'stocks',
      description: 'Buy shares in a stock of your choosing.',
      args: [
        new Argument({
          name: 'shares',
          key: 'shares',
          type: 'int',
          example: '3'
        }),
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
    const stock = await msg._client.tradingView.getTicker(args.ticker).catch(() => null);

    if (!stock) {
      return msg.createErrorReply(`the stock \`${args.ticker}\` doesn't exist.`);
    }

    const price = NumberUtil.fromValue((stock.lp || stock.bid) * args.shares);

    if (msg.dbUser.portfolio[args.ticker].shares < args.shares) {
      return msg.createReply(`you do not have ${args.shares} shares of ${stock.short_name}.`);
    }

    const shares = `portfolio.${args.ticker}.shares`;
    const spent = `portfolio.${args.ticker}.spent`;
    const moneyDifference = price - msg.dbUser.portfolio[args.ticker].spent;

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: {
        [shares]: -args.shares, cash: moneyDifference, [spent]: -moneyDifference
      }
    });

    return msg.createReply(`you've successfully sold ${args.shares} shares of\
${stock.short_name} for ${NumberUtil.format(price)}`);
  }
}

module.exports = new SellShares();
