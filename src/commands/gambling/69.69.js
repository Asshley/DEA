const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { GAMBLING }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');
const WIN = 69.69;
const PAYOUT = 6969;

class _6969 extends Command {
  constructor() {
    super({
      names: ['69.69', '6969'],
      groupName: 'gambling',
      description: 'The command only gods can win',
      args: [
        new Argument({
          name: 'bet',
          key: 'bet',
          type: 'cash',
          example: '500',
          preconditionOptions: [{ minimum: GAMBLING.MINIMUM_BET }],
          preconditions: ['minimumcash', 'cash']
        })
      ]
    });
  }

  async run(msg, args) {
    const random = Random.roll();

    if (random === WIN) {
      const won = args.bet * PAYOUT;
      const res = await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, won);

      return msg.createReply(StringUtil.format(
        messages.commands.gambling.successful,
        random, NumberUtil.toUSD(won), NumberUtil.format(res.cash)
      ));
    }

    const res = await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.bet);

    return msg.createReply(StringUtil.format(
      messages.commands.gambling.failed,
      random, NumberUtil.toUSD(args.bet), NumberUtil.format(res.cash)
    ));
  }
}

module.exports = new _6969();
