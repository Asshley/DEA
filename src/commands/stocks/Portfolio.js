const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const messages = require('../../../data/messages.json');

class Portfolio extends Command {
  constructor() {
    super({
      names: ['portfolio'],
      groupName: 'stocks',
      description: 'See a user\'s portfolio.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: ArgumentDefault.Member,
          example: 'Blast It Baby#6969',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = args.member.id === msg.member.id ? msg.dbUser : await args.member.dbUser();
    const keys = Object.keys(dbUser.portfolio);
    let reply = '';
    let totalProfits = 0;
    let totalPercentageProfits = 0;

    for (let i = 0; i < keys.length; i++) {
      if (dbUser.portfolio[keys[i]].shares > 0) {
        const key = keys[i];
        const stock = await msg._client.tradingView.getTicker(key);
        const { shares } = dbUser.portfolio[key].shares;
        const { spent } = dbUser.portfolio[key].spent;
        const sharesPrice = NumberUtil.fromValue((stock.lp || stock.bid) * shares);
        const wealth = sharesPrice - spent;
        const percentageProfit = NumberUtil.fromValue(wealth / sharesPrice);

        totalProfits += wealth;
        totalPercentageProfits += percentageProfit;
        reply += StringUtil.format(
          messages.commands.portfolio.message, key.toUpperCase(), shares,
          NumberUtil.format(wealth),
          NumberUtil.value(Math.round(NumberUtil.fromValue(percentageProfit)))
        );
      }
    }

    const tag = `${args.member.user.username}#${args.member.user.discriminator}`;

    if (StringUtil.isNullOrWhiteSpace(reply)) {
      return msg.channel.createErrorMessage(StringUtil.format(
        messages.commands.portfolio.none,
        args.member.id === msg.author.id ? 'You have' : `${StringUtil.boldify(tag)} has`,
        args.member.id === msg.author.id ? 'your' : 'their'
      ));
    }

    const total = NumberUtil.value(Math.round(NumberUtil.fromValue(totalPercentageProfits)));
    const format = `${NumberUtil.format(totalProfits)} (${total})\n\n${reply}`;

    return msg.channel.sendMessage(format, { title: `${tag}'s Portfolio:` });
  }
}

module.exports = new Portfolio();
