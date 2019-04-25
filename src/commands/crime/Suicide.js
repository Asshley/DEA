const { Command } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { SUICIDE } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Suicide extends Command {
  constructor() {
    super({
      names: ['suicide', 'kms'],
      groupName: 'crime',
      description: 'Kill yourself.'
    });
  }

  async run(msg) {
    if (NumberUtil.value(msg.dbUser.cash) < SUICIDE.CASH_REQUIRED) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.suicide.failed, NumberUtil.toUSD(SUICIDE.CASH_REQUIRED)
      ));
    }

    const update = {
      $set: {
        inventory: {},
        investments: [],
        health: 100,
        cash: 0
      }
    };

    await msg._client.db.userRepo.updateUser(msg.member.id, msg.channel.guild.id, update);

    return msg.createReply(messages.commands.suicide.successful);
  }
}

module.exports = new Suicide();
