const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { TRANSFER: { MINIMUM_CASH: MINIMUM_TRANSFER } },
  MISCELLANEA: { TRANSACTION_FEE }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class Transfer extends Command {
  constructor() {
    super({
      names: ['transfer', 'sauce', 'donate'],
      groupName: 'general',
      description: 'Transfer money to any member.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Supa Hot Fire#1337"',
          preconditions: ['noself']
        }),
        new Argument({
          name: 'transfer',
          key: 'transfer',
          type: 'cash',
          example: '500',
          preconditionOptions: [{ minimum: MINIMUM_TRANSFER }],
          preconditions: ['minimumcash', 'cash']
        })
      ]
    });
  }

  async run(msg, args) {
    const transactionFee = args.transfer * TRANSACTION_FEE;
    const received = args.transfer - transactionFee;
    const newDbUser = await msg.client.db.userRepo
      .modifyCash(msg.dbGuild, msg.member, -args.transfer);

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, args.member, received);

    return msg.createReply(`you have successfully transfered ${NumberUtil.toUSD(received)} to \
${StringUtil.boldify(args.member.user.tag)}. Transaction fee: ${NumberUtil.toUSD(transactionFee)}. \
Balance: ${NumberUtil.format(newDbUser.cash)}.`);
  }
}

module.exports = new Transfer();
