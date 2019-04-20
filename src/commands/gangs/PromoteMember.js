const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class PromoteMember extends Command {
  constructor() {
    super({
      names: ['promotemember'],
      groupName: 'gangs',
      description: 'Promotes member in your gang.',
      preconditions: ['ingang', 'gangowner'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'vim2faggotasshole#3630',
          preconditions: ['noself'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = msg.dbGang;

    if (gang.members.some(v => v.status === 'elder' && v.id === args.member.id)) {
      return msg.createErrorReply('this member is already an elder.');
    } else if (!gang.members.some(x => x.id === args.member.id)) {
      return msg.createErrorReply('this member isn\'t in your gang');
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const memberIndex = gang.members.findIndex(x => x.id === args.member.id);
    const update = {
      $set: {
        [`gangs.${gangIndex}.members.${memberIndex}.status`]: 'elder'
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you've successfully promoted \
${StringUtil.boldify(args.member.user.tag)} to an elder in your gang.`);
  }
}

module.exports = new PromoteMember();
