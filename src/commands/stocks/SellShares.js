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
          defaultValue: '',
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

    const numShares = args.shares || msg.dbUser.portfolio[lower].shares;

    if (!numShares || args.shares > numShares) {
      return msg.createReply(`you do not have ${args.shares} shares of ${stock.short_name}.`);
    }

    const price = NumberUtil.fromValue((stock.lp || stock.bid) * numShares);
    const shares = `portfolio.${lower}.shares`;
    const spent = `portfolio.${lower}.spent`;
    const profit = price - msg.dbUser.portfolio[lower].spent;
    const fmtShares = NumberUtil.display(numShares);

    if (msg.dbUser.portfolio[lower].shares - numShares > 0) {
      await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
        $inc: {
          [shares]: -numShares, cash: price, [spent]: -price
        }
      });

      return msg.createReply(`you've successfully sold ${fmtShares} shares of ${stock.short_name} \
for ${NumberUtil.format(price)}, making ${NumberUtil.format(profit)} in profit.`);
    }

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $unset: { [`portfolio.${lower}`]: '' }, $inc: { cash: price }
    });

    return msg.createReply(`you've successfully sold ${fmtShares} shares of ${stock.short_name} \
for ${NumberUtil.format(price)}.`);
  }
}

module.exports = new SellShares();
