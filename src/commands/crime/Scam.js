const { Command } = require('patron.js');
const {
  ODDS: { SCAM: SCAM_ODDS },
  RESTRICTIONS: { COMMANDS: { SCAM } }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const messages = require('../../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');

class Scam extends Command {
  constructor() {
    super({
      names: ['scam', 'whore'],
      groupName: 'crime',
      description: 'Scam some noobs on the streets.',
      postconditions: ['reducedcooldown'],
      cooldown: cooldowns.commands.scam
    });
  }

  async run(msg) {
    if (Random.roll() < SCAM_ODDS) {
      const prize = Random.nextFloat(SCAM.MINIMUM_CASH, SCAM.MAXIMUM_CASH);

      await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

      return msg.createReply(StringUtil.format(
        Random.arrayElement(messages.commands.scam.successful), NumberUtil.toUSD(prize)
      ));
    }

    return msg.createErrorReply(messages.commands.scam.failed);
  }
}

module.exports = new Scam();
