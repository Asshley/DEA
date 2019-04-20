const { Command, Argument } = require('patron.js');
const {
  MESSAGES: { GANG }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');

class DemoteMember extends Command {
  constructor() {
    super({
      names: ['demotemember'],
      groupName: 'gangs',
      description: 'Demotes a member in your gang.',
      preconditions: ['ingang', 'gangowner'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'lolgae#3630',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = msg.dbGang;

    if (!gang.members.some(v => v.status === 'elder' && v.id === args.member.id)) {
      return msg.createErrorReply(GANG.INVALID_DEMOTE);
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const memberIndex = gang.members.findIndex(x => x.id === args.member.id);
    const update = {
      $set: {
        [`gangs.${gangIndex}.members.${memberIndex}.status`]: 'member'
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(
      StringUtil.format(GANG.DEMOTE, StringUtil.boldify(args.member.user.tag))
    );
  }
}

module.exports = new DemoteMember();
