const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Leaderboard extends Command {
  constructor() {
    super({
      names: [
        'leaderboard',
        'lb',
        'highscores',
        'highscore',
        'leaderboards'
      ],
      groupName: 'general',
      description: 'View the richest Drug Traffickers.'
    });
  }

  async run(msg) {
    const users = await msg._client.db.userRepo.findMany({ guildId: msg.channel.guild.id });
    let message = '';

    users.sort((a, b) => b.cash - a.cash);

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > LEADERBOARD_CAP) {
        break;
      }

      const user = msg._client.users.get(users[i].userId);

      if (!user) {
        users.splice(i, 1);
        i--;
        continue;
      }

      message += StringUtil.format(
        messages.commands.leaderboard.message,
        i + 1,
        StringUtil.boldify(`${user.username}#${user.discriminator}`),
        NumberUtil.format(users[i].cash)
      );
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply(messages.commands.leaderboard.none);
    }

    return msg.channel.sendMessage(message, { title: 'The Richest Traffickers' });
  }
}

module.exports = new Leaderboard();
