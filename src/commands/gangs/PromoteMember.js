const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
    const memberIndex = gang.members.findIndex(x => x.id === args.member.id);

    if (memberIndex === -1) {
      return msg.createErrorReply(messages.commands.promoteMember.notInGang);
    } else if (gang.members[memberIndex].status === 'elder') {
      return msg.createErrorReply(messages.commands.promoteMember.alreadyElder);
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $set: {
        [`gangs.${gangIndex}.members.${memberIndex}.status`]: 'elder'
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.promoteMember.successful,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`)
    ));
  }
}

module.exports = new PromoteMember();
