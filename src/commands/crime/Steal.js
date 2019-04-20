const { Command } = require('patron.js');
const {
  MESSAGES,
  ODDS: { STEAL: STEAL_ODDS },
  RESTRICTIONS: { COMMANDS: { STEAL } },
  COOLDOWNS: { STEAL: STEAL_COOLDOWN }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Steal extends Command {
  constructor() {
    super({
      names: ['steal'],
      groupName: 'crime',
      description: 'Hop the big guns and lick a store.',
      postconditions: ['reducedcooldown'],
      cooldown: STEAL_COOLDOWN
    });
  }

  async run(msg) {
    if (Random.roll() < STEAL_ODDS) {
      const prize = Random.nextFloat(STEAL.MINIMUM_CASH, STEAL.MAXIMUM_CASH);

      await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

      return msg.createReply(
        StringUtil.format(
          Random.arrayElement(MESSAGES.STEAL),
          Random.arrayElement(MESSAGES.STORES),
          NumberUtil.toUSD(prize)
        )
      );
    }

    return msg.createErrorReply(`you ran over to ${Random.arrayElement(MESSAGES.STORES)}, \
tried to steal a nerf gun but got jumped by some autistic emo kid and he stole your money!`);
  }
}

module.exports = new Steal();
