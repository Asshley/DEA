const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class ItemLeaderboard extends Command {
  constructor() {
    super({
      names: ['itemleaderboard', 'itemlb', 'itemleaderboard'],
      groupName: 'general',
      description: 'View the most armed people.'
    });
  }

  async run(msg) {
    const getUsers = await msg._client.db.userRepo.findMany({ guildId: msg.channel.guild.id });
    const users = getUsers.filter(x => Object.values(x.inventory).length > 0);
    const fn = (accumulator, currentValue) => accumulator + currentValue;
    let message = '';

    users.sort(
      (a, b) => Object.values(b.inventory).reduce(fn) - Object.values(a.inventory).reduce(fn)
    );

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
        messages.commands.itemLeaderboard.message,
        i + 1,
        StringUtil.boldify(`${user.username}#${user.discriminator}`),
        Object.values(users[i].inventory).reduce(fn)
      );
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply(messages.commands.itemLeaderboard.none);
    }

    return msg.channel.sendMessage(message, { title: 'The Item Leaderboards' });
  }
}

module.exports = new ItemLeaderboard();
