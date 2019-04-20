const { Command, Argument } = require('patron.js');
const {
  ODDS: { DICE: DICE_ODDS },
  RESTRICTIONS: { GAMBLING, COMMANDS: { DICE } }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Util = require('../../utility/Util.js');
const MAX_DICE_ROLL = 7;

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
      const newDbUser = await msg.client.db.userRepo
        .modifyCash(msg.dbGuild, msg.member, args.bet * DICE.PAYOUT);

      return msg.createReply(`${baseMessage} won you ${NumberUtil.toUSD(args.bet)}. Balance: \
${NumberUtil.format(newDbUser.cash)}.`);
    }

    const newDbUser = await msg.client.db.userRepo
      .modifyCash(msg.dbGuild, msg.member, -args.bet);

    return msg.createReply(`${baseMessage} lost you ${NumberUtil.toUSD(args.bet)}. Balance: \
${NumberUtil.format(newDbUser.cash)}.`);
  }
}

module.exports = new Dice();
