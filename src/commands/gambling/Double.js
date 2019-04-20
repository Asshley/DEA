const { Command } = require('patron.js');
const {
  MAX_AMOUNTS: { DOUBLE_WINS },
  RESTRICTIONS: { COMMANDS: { DOUBLE } },
  ODDS: { DOUBLE: DOUBLE_ODDS }
} = require('../../utility/Constants.js');
const { Collection } = require('discord.js');
const history = new Collection();
const NumberUtil = require('../../utility/NumberUtil.js');
const Random = require('../../utility/Random.js');

class Double extends Command {
  constructor() {
    super({
      names: ['double'],
      groupName: 'gambling',
      description: 'Double your cash with no strings attached.'
    });
  }

  async run(msg) {
    if (NumberUtil.value(msg.dbUser.cash) < DOUBLE.MINIMUM) {
      return msg.createErrorReply(
        `you need at least ${NumberUtil.toUSD(DOUBLE.MINIMUM)} for me to work with.`
      );
    }

    const key = `${msg.author.id}-${msg.guild.id}`;
    const value = history.get(key) || 0;
    const roll = Random.roll();
    const inGang = msg.dbGang;
    const odds = inGang ? DOUBLE_ODDS.GANG_ODDS : DOUBLE_ODDS.ODDS;

    if (value < DOUBLE_WINS && roll < odds) {
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $mul: { cash: 2 } });
      history.set(key, value + 1);
    } else {
      history.set(key, 1);
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { cash: 0 } });
    }

    return msg.createReply('I\'ve successfully doubled your cash. If your cash isn\'t doubled by \
now then it will automatically replenish itself over time.');
  }
}

module.exports = new Double();
