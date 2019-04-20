const { Command, Argument } = require('patron.js');
const {
  INVESTMENTS
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class Investments extends Command {
  constructor() {
    super({
      names: ['investments', 'invest'],
      groupName: 'crime',
      description: 'Buy some slick shit.',
      args: [
        new Argument({
          name: 'investment',
          key: 'investment',
          type: 'string',
          example: 'line',
          defaultValue: '',
          preconditions: ['investment']
        })
      ]
    });
  }

  async run(msg, args) {
    if (StringUtil.isNullOrWhiteSpace(args.investment)) {
      const message = Object.keys(INVESTMENTS)
        .map(x => `${StringUtil.boldify(StringUtil.upperFirstChar(x.toLowerCase()))}, \
**Cost:** ${NumberUtil.toUSD(INVESTMENTS[x].COST)} | ${INVESTMENTS[x].DESCRIPTION}`);

      return msg.channel.createMessage(message.join('\n'), { title: 'Available Investments' });
    }

    const update = {
      $push: {
        investments: args.investment.toLowerCase()
      }
    };
    const { COST } = INVESTMENTS[args.investment.toUpperCase()];

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, update);
    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -COST);

    return msg.createReply(`you've successfully purchased ${StringUtil
      .boldify(StringUtil.upperFirstChar(args.investment.toLowerCase()))}.`);
  }
}

module.exports = new Investments();
