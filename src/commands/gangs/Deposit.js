const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { TRANSFER },
  MISCELLANEA: { TRANSACTION_FEE, DECIMAL_ROUND_AMOUNT, TO_PERCENT_AMOUNT },
  MESSAGES: { GANG }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');

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

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.transfer);
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $inc: {
        [`gangs.${gangIndex}.wealth`]: deposited
      }
    });

    const leader = msg.guild.members.get(gang.leaderId);

    await MessageUtil.notify(
      leader,
      StringUtil.format(
        GANG.DEPOSIT_DM, StringUtil.boldify(msg.author.tag), NumberUtil.toUSD(received)
      ),
      'deposit'
    );

    return msg.createReply(
      StringUtil.format(
        GANG.DEPOSIT_REPLY, NumberUtil.toUSD(received), NumberUtil.toUSD(transactionFee)
      ),
      {
        footer: {
          text: `Wealth: ${NumberUtil.format(gang.wealth + deposited)}`
        }
      }
    );
  }
}

module.exports = new Deposit();
