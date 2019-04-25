const { Command, Argument } = require('patron.js');
const {
  COOLDOWNS: { WITHDRAW: WITHDRAW_COOLDOWN },
  RESTRICTIONS: { COMMANDS: { GANG: { MINIMUM_AMOUNT } } },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT, TO_PERCENT_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const messages = require('../../../data/messages.json');

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
          preconditions: ['minimumcash', 'withdraw']
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = msg.dbGang;
    const leader = msg.channel.guild.members.get(gang.leaderId);
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const taken = -args.transfer * TO_PERCENT_AMOUNT;

    await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, args.transfer);
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $inc: {
        [`gangs.${gangIndex}.wealth`]: NumberUtil.round(taken, DECIMAL_ROUND_AMOUNT)
      }
    });

    const wealth = gang.wealth + taken;

    await MessageUtil.notify(leader, StringUtil.format(
      messages.commands.withdraw.DM,
      StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`),
      NumberUtil.toUSD(args.transfer)
    ), 'withdraw');

    return msg.createReply(StringUtil.format(
      messages.commands.withdraw.reply,
      NumberUtil.toUSD(args.transfer),
      gang.name,
      NumberUtil.format(wealth)
    ));
  }
}

module.exports = new Withdraw();
