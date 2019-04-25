const { Command } = require('patron.js');
const {
  COOLDOWNS: { JUMP: JUMP_COOLDOWN },
  RESTRICTIONS: { COMMANDS: { JUMP } },
  ODDS: { JUMP: JUMP_ODDS }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Jump extends Command {
  constructor() {
    super({
      names: ['jump'],
      groupName: 'crime',
      description: 'Jump some trash for cash on the street.',
      postconditions: ['reducedcooldown'],
      cooldown: JUMP_COOLDOWN
    });
  }

  async run(msg) {
    if (Random.roll() < JUMP_ODDS) {
      const prize = Random.nextFloat(JUMP.MINIMUM_CASH, JUMP.MAXIMUM_CASH);

      await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

      const message = StringUtil.format(
        Random.arrayElement(messages.commands.jump.messages), NumberUtil.toUSD(prize)
      );

      return msg.createReply(message);
    }

    return msg.createErrorReply(messages.commands.jump.failed);
  }
}

module.exports = new Jump();
