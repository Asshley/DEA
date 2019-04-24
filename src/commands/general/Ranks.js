const { Command } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.ranks.none);
    }

    ranks.sort((a, b) => a.cashRequired - b.cashRequired);

    let description = '';

    for (let i = 0; i < ranks.length; i++) {
      const rank = msg.channel.guild.roles.get(ranks[i].id);

      description += StringUtil.format(
        messages.commands.ranks.message, rank.mention, NumberUtil.toUSD(ranks[i].cashRequired)
      );
    }

    return msg.channel.sendMessage(description, { title: 'Ranks' });
  }
}

module.exports = new Ranks();
