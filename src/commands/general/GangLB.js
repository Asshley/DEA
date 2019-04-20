const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class GangLB extends Command {
  constructor() {
    super({
      names: ['ganglb', 'gangs'],
      groupName: 'general',
      description: 'Richest Gangs.'
    });
  }

  async run(msg) {
    const guilds = await msg.client.db.guildRepo.findMany({ guildId: msg.guild.id });
    let message = '';

    for (let i = 0; i < guilds.length; i++) {
      const { gangs } = guilds[i];

      gangs.sort((a, b) => b.wealth - a.wealth);

      for (let m = 0; m < gangs.length; m++) {
        if (m + 1 > LEADERBOARD_CAP) {
          break;
        }

        const gang = gangs[m];

        message += `${m + 1}. ${StringUtil.boldify(gang.name)} (${gang.index}): \
${NumberUtil.format(gang.wealth)}\n`;
      }
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there are no gangs.');
    }

    return msg.channel.createMessage(message, { title: 'The Wealthiest Gangs' });
  }
}

module.exports = new GangLB();
