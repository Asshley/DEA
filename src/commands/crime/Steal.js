const { Command } = require('patron.js');
const {
  ODDS: { STEAL: STEAL_ODDS },
  RESTRICTIONS: { COMMANDS: { STEAL } },
  COOLDOWNS: { STEAL: STEAL_COOLDOWN }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const messages = require('../../data/messages.json');

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
    const store = Random.arrayElement(messages.commands.steal.stores);

    if (Random.roll() < STEAL_ODDS) {
      const prize = Random.nextFloat(STEAL.MINIMUM_CASH, STEAL.MAXIMUM_CASH);

      await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

      return msg.createReply(StringUtil.format(
        Random.arrayElement(messages.commands.steal.successful), store, NumberUtil.toUSD(prize)
      ));
    }

    return msg.createErrorReply(StringUtil.format(
      messages.commands.steal.failed, store
    ));
  }
}

module.exports = new Steal();
