const { Command, Argument } = require('patron.js');
const {
  ODDS: { DICE: DICE_ODDS },
  RESTRICTIONS: { GAMBLING, COMMANDS: { DICE } }
} = require('../../utility/Constants.js');
const MAX_DICE_ROLL = 7;
const Random = require('../../utility/Random.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const messages = require('../../data/messages.json');

class Dice extends Command {
  constructor() {
    super({
      names: ['dice'],
      groupName: 'gambling',
      description: 'Provably fair gambling using the classic dice game we all know and love.',
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
    const rolls = Array.from({ length: 3 }, () => Random.nextInt(1, MAX_DICE_ROLL));
    const total = rolls.reduce((a, b) => a + b);
    const type = Random.roll() > DICE_ODDS ? 'soft' : 'hard';
    const baseMessage = `you rolled ${Util.list(rolls, 'and')}. Your ${type} ${total}`;

    if (Random.roll() >= DICE_ODDS) {
      const res = await msg._client.db
        .userRepo.modifyCash(msg.dbGuild, msg.member, args.bet * DICE.PAYOUT);

      return msg.createReply(StringUtil.format(
        messages.commands.dice.successful,
        baseMessage,
        NumberUtil.toUSD(args.bet),
        NumberUtil.format(res.cash)
      ));
    }

    const res = await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.bet);

    return msg.createReply(StringUtil.format(
      messages.commands.dice.failed,
      baseMessage,
      NumberUtil.toUSD(args.bet),
      NumberUtil.format(res.cash)
    ));
  }
}

module.exports = new Dice();
