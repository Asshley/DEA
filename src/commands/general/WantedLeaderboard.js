const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class WantedLeaderboard extends Command {
  constructor() {
    super({
      names: ['wantedleaderboard', 'wanted', 'bounties', 'bl'],
      groupName: 'general',
      description: 'View the most Targeted Drug Traffickers.'
    });
  }

  async run(msg) {
    const users = await msg._client.db.userRepo.findMany({ guildId: msg.channel.guild.id });
    const sorted = users.filter(x => x.bounty).sort((a, b) => b.bounty - a.bounty);
    let message = '';

    for (let i = 0; i < sorted.length; i++) {
      if (i + 1 > LEADERBOARD_CAP) {
        break;
      }

      const user = msg._client.users.get(sorted[i].userId);

      if (!user) {
        continue;
      }

      message += StringUtil.format(
        messages.commands.wantedLeaderboard.message,
        i + 1,
        StringUtil.boldify(`${user.username}#${user.discriminator}`),
        NumberUtil.format(sorted[i].bounty)
      );
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply(messages.commands.wantedLeaderboard.none);
    }

    return msg.channel.sendMessage(message, { title: 'The Most Targeted Traffickers' });
  }
}

module.exports = new WantedLeaderboard();
