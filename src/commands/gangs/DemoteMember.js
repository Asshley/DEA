const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
    const memberIndex = gang.members.findIndex(x => x.id === args.member.id);

    if (gang.members[memberIndex].status !== 'elder') {
      return msg.createErrorReply(messages.commands.demoteMember.failed);
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $set: {
        [`gangs.${gangIndex}.members.${memberIndex}.status`]: 'member'
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.demoteMember.successful,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`)
    ));
  }
}

module.exports = new DemoteMember();
