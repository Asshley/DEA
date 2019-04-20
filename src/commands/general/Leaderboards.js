const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class Leaderboards extends Command {
  constructor() {
    super({
      names: [
        'leaderboards',
        'lb',
        'highscores',
        'highscore',
        'leaderboard'
      ],
      groupName: 'general',
      description: 'View the richest Drug Traffickers.'
    });
  }

  async run(msg) {
    const users = await msg.client.db.userRepo.findMany({ guildId: msg.guild.id });
    let message = '';

    users.sort((a, b) => b.cash - a.cash);

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > LEADERBOARD_CAP) {
        break;
      }

      const user = msg.client.users.get(users[i].userId);

      if (!user) {
        users.splice(i, 1);
        i--;
        continue;
      }

      message += `${i + 1}. ${StringUtil.boldify(user.tag)}: ${NumberUtil.format(users[i].cash)}\n`;
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the leaderboards.');
    }

    return msg.channel.createMessage(message, { title: 'The Richest Traffickers' });
  }
}

module.exports = new Leaderboards();
