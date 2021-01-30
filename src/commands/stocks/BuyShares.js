const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class BuyShares extends Command {
  constructor() {
    super({
      names: ['buyshares', 'bs', 'yolo'],
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

    if (msg.dbUser.cash < price) {
      return msg.createReply(`you do not have ${NumberUtil.format(price)} for \
${args.shares} shares of ${stock.short_name}`);
    }

    const shares = `portfolio.${args.ticker}.shares`;
    const spent = `portfolio.${args.ticker}.spent`;
    const moneyLost = price;

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: {
        [shares]: args.shares, cash: -moneyLost, [spent]: price
      }
    });

    return msg.createReply(`you've successfully bought ${args.shares} shares \
of ${stock.short_name} for ${NumberUtil.format(price)}`);
  }
}

module.exports = new BuyShares();
