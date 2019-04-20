const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');

class ItemLB extends Command {
  constructor() {
    super({
      names: ['itemleaderboards', 'itemlb', 'itemleaderboard'],
      groupName: 'general',
      description: 'View the most armed people.'
    });
  }

  async run(msg) {
    const getUsers = await msg.client.db.userRepo.findMany({ guildId: msg.guild.id });
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

      const user = msg.client.users.get(users[i].userId);

      if (!user) {
        users.splice(i, 1);
        i--;
        continue;
      }

      message += `${i + 1}. ${StringUtil.boldify(user.tag)}: \
${Object.values(users[i].inventory).reduce(fn)}\n`;
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the item leaderboards.');
    }

    return msg.channel.createMessage(message, { title: 'The Item Leaderboards' });
  }
}

module.exports = new ItemLB();
