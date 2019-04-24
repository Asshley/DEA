const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class GangLeaderboard extends Command {
  constructor() {
    super({
      names: ['gangleaderboard', 'ganglb', 'gangs'],
      groupName: 'general',
      description: 'Richest Gangs.'
    });
  }

  async run(msg) {
    const guilds = await msg._client.db.guildRepo.findMany({ guildId: msg.channel.guild.id });
    let message = '';

    for (let i = 0; i < guilds.length; i++) {
      const { gangs } = guilds[i];

      gangs.sort((a, b) => b.wealth - a.wealth);

      for (let m = 0; m < gangs.length; m++) {
        if (m + 1 > LEADERBOARD_CAP) {
          break;
        }

        const gang = gangs[m];

        message += StringUtil.format(
          messages.commands.gangLeaderboard.message,
          m + 1,
          StringUtil.boldify(gang.name),
          gang.index,
          NumberUtil.format(gang.wealth)
        );
      }
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply(messages.commands.gangLeaderboard.none);
    }

    return msg.channel.sendMessage(message, { title: 'The Wealthiest Gangs' });
  }
}

module.exports = new GangLeaderboard();
