const { Command, Argument } = require('patron.js');
const {
  COOLDOWNS: { WITHDRAW: WITHDRAW_COOLDOWN },
  RESTRICTIONS: { COMMANDS: { GANG: { MINIMUM_AMOUNT } } },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT, TO_PERCENT_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');

class Withdraw extends Command {
  constructor() {
    super({
      names: ['withdraw'],
      groupName: 'gangs',
      description: 'Withdraw money from your gang.',
      postconditions: ['reducedcooldown'],
      cooldown: WITHDRAW_COOLDOWN,
      preconditions: ['ingang'],
      args: [
        new Argument({
          name: 'amount',
          key: 'transfer',
          type: 'amount',
          example: '500',
          preconditionOptions: [{ minimum: MINIMUM_AMOUNT }],
          preconditions: ['minimumcash', 'withdrawprec']
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = msg.dbGang;
    const leader = msg.guild.members.get(gang.leaderId);
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const taken = -args.transfer * TO_PERCENT_AMOUNT;

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, args.transfer);
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $inc: {
        [`gangs.${gangIndex}.wealth`]: NumberUtil.round(taken, DECIMAL_ROUND_AMOUNT)
      }
    });

    const wealth = gang.wealth + taken;

    await MessageUtil.notify(leader, `${StringUtil.boldify(msg.author.tag)} has withdrawn \
${NumberUtil.toUSD(args.transfer)} from your gang.`, 'withdraw');

    return msg.createReply(`you have successfully withdrawn ${NumberUtil.toUSD(args.transfer)} \
from your gang. ${gang.name}'s Wealth: ${NumberUtil.format(wealth)}.`);
  }
}

module.exports = new Withdraw();
