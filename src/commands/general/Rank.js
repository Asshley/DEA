const { Command, Argument, ArgumentDefault } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const RankService = require('../../services/RankService.js');

class Rank extends Command {
  constructor() {
    super({
      names: ['rank'],
      groupName: 'general',
      description: 'View the rank of anyone.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: ArgumentDefault.Member,
          example: 'Blast It Baby#6969',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = await args.member.dbUser();
    const rank = RankService.getRank(dbUser, msg.dbGuild, msg.guild);
    const { investments: invested } = dbUser;
    const options = {
      title: `${args.member.user.tag}'s Rank`,
      footer: {
        text: invested.length ? `Investments: \
${Util.list(invested, 'and', StringUtil.upperFirstChar)}` : ''
      }
    };
    const info = await this.formatInfo(dbUser, rank, msg.client.db);

    return msg.channel.createMessage(info, options);
  }

  async formatInfo(dbUser, rank, db) {
    const users = (await db.userRepo.findMany({ guildId: dbUser.guildId }))
      .sort((a, b) => b.cash - a.cash);
    let string = `**Balance:** ${NumberUtil.format(dbUser.cash)}\n**Health:** ${dbUser.health}
**Position:** ${users.findIndex(x => x.userId === dbUser.userId) + 1}`;

    if (dbUser.bounty) {
      string += `\n**Bounty:** ${NumberUtil.format(dbUser.bounty)}`;
    }

    if (rank) {
      string += `\n**Rank:** ${rank}`;
    }

    return string;
  }
}

module.exports = new Rank();
