const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class Wanted extends Command {
  constructor() {
    super({
      names: ['wanted', 'bounties', 'bl', 'bountyleaderboards'],
      groupName: 'general',
      description: 'View the most Targeted Drug Traffickers.'
    });
  }

  async run(msg) {
    const users = await msg.client.db.userRepo.findMany({ guildId: msg.guild.id });
    const sorted = users.filter(x => x.bounty).sort((a, b) => b.bounty - a.bounty);
    let message = '';

    for (let i = 0; i < sorted.length; i++) {
      if (i + 1 > LEADERBOARD_CAP) {
        break;
      }

      const user = msg.client.users.get(sorted[i].userId);

      if (!user) {
        continue;
      }

      message += `${i + 1}. ${StringUtil.boldify(user.tag)}: \
${NumberUtil.format(sorted[i].bounty)}\n`;
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the bounty leaderboards yet.');
    }

    return msg.channel.createMessage(message, { title: 'The Most Targeted Traffickers' });
  }
}

module.exports = new Wanted();
