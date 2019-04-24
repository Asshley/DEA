const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { TRANSFER },
  MISCELLANEA: { TRANSACTION_FEE, DECIMAL_ROUND_AMOUNT, TO_PERCENT_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const messages = require('../../data/messages.json');

class Deposit extends Command {
  constructor() {
    super({
      names: ['deposit'],
      groupName: 'gangs',
      description: 'Deposit into a gangs wealth.',
      preconditions: ['ingang'],
      args: [
        new Argument({
          name: 'amount',
          key: 'transfer',
          type: 'cash',
          example: '500',
          preconditionOptions: [{ minimum: TRANSFER.MINIMUM_CASH }],
          preconditions: ['minimumcash', 'cash']
        })
      ]
    });
  }

  async run(msg, args) {
    const transactionFee = args.transfer * TRANSACTION_FEE;
    const received = args.transfer - transactionFee;
    const gang = msg.dbGang;
    const deposited = NumberUtil.round(received, DECIMAL_ROUND_AMOUNT) * TO_PERCENT_AMOUNT;
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);

    await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.transfer);
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $inc: {
        [`gangs.${gangIndex}.wealth`]: deposited
      }
    });

    const leader = msg.channel.guild.members.get(gang.leaderId);

    await MessageUtil.notify(leader, StringUtil.format(
      messages.commands.deposit.DM,
      StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`),
      NumberUtil.toUSD(received)
    ), 'deposit');

    return msg.createReply(StringUtil.format(
      messages.commands.deposit.reply,
      NumberUtil.toUSD(transactionFee),
      NumberUtil.toUSD(received),
      NumberUtil.format(gang.wealth + deposited)
    ));
  }
}

module.exports = new Deposit();
