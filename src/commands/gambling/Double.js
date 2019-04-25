const { Command } = require('patron.js');
const {
  MAX_AMOUNTS: { DOUBLE_WINS },
  RESTRICTIONS: { COMMANDS: { DOUBLE } },
  ODDS: { DOUBLE: DOUBLE_ODDS }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const Random = require('../../utility/Random.js');
const messages = require('../../../data/messages.json');

class Double extends Command {
  constructor() {
    super({
      names: ['double'],
      groupName: 'gambling',
      description: 'Double your cash with no strings attached.'
    });
    this.history = {};
  }

  async run(msg) {
    if (NumberUtil.value(msg.dbUser.cash) < DOUBLE.MINIMUM) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.double.needsCash,
        NumberUtil.toUSD(DOUBLE.MINIMUM)
      ));
    }

    const key = `${msg.author.id}-${msg.channel.guild.id}`;
    const value = this.history[key] || 0;
    const roll = Random.roll();
    const inGang = msg.dbGang;
    const odds = inGang ? DOUBLE_ODDS.GANG_ODDS : DOUBLE_ODDS.ODDS;

    if (value < DOUBLE_WINS && roll < odds) {
      await msg._client.db.userRepo.updateUser(
        msg.author.id, msg.channel.guild.id, { $mul: { cash: 2 } }
      );
      this.history[key] = value + 1;
    } else {
      this.history[key] = 1;
      await msg._client.db.userRepo.updateUser(
        msg.author.id, msg.channel.guild.id, { $set: { cash: 0 } }
      );
    }

    return msg.createReply(messages.commands.double.reply);
  }
}

module.exports = new Double();
