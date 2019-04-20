const { Command } = require('patron.js');
const {
  MESSAGES,
  ODDS: { SCAM: SCAM_ODDS },
  RESTRICTIONS: { COMMANDS: { SCAM } },
  COOLDOWNS: { SCAM: SCAM_COOLDOWN }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Scam extends Command {
  constructor() {
    super({
      names: ['scam', 'whore'],
      groupName: 'crime',
      description: 'Scam some noobs on the streets.',
      postconditions: ['reducedcooldown'],
      cooldown: SCAM_COOLDOWN
    });
  }

  async run(msg) {
    if (Random.roll() < SCAM_ODDS) {
      const prize = Random.nextFloat(SCAM.MINIMUM_CASH, SCAM.MAXIMUM_CASH);

      await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

      return msg.createReply(
        StringUtil.format(Random.arrayElement(MESSAGES.SCAM), NumberUtil.toUSD(prize))
      );
    }

    return msg.createErrorReply(
      'you waited in line for some new Adidas Yeezys and bought 10 just to realise they were fake!.'
    );
  }
}

module.exports = new Scam();
