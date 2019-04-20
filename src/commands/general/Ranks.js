const { Command } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Ranks extends Command {
  constructor() {
    super({
      names: ['ranks'],
      groupName: 'general',
      description: 'View all ranks in this server.'
    });
  }

  async run(msg) {
    const ranks = msg.dbGuild.roles.rank;

    if (!ranks.length) {
      return msg.createErrorReply('there are no rank roles yet.');
    }

    const sortedRanks = ranks.sort((a, b) => a.cashRequired - b.cashRequired);
    let description = '';

    for (let i = 0; i < sortedRanks.length; i++) {
      const rank = msg.guild.roles.get(sortedRanks[i].id);

      description += `${rank}: ${NumberUtil.toUSD(sortedRanks[i].cashRequired)}\n`;
    }

    return msg.channel.createMessage(description, { title: 'Ranks' });
  }
}

module.exports = new Ranks();
