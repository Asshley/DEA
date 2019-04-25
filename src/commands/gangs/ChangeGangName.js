const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { GANG: { NAME: MAX_NAME } },
  REGEXES: { GANG_NAME: NAME_REGEX },
  RESTRICTIONS: { COMMANDS: { GANG: { NAME_CHANGE_COST } } }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class ChangeGangName extends Command {
  constructor() {
    super({
      names: ['changegangname', 'changegangsname', 'changegangname'],
      groupName: 'gangs',
      description: 'Changes your gang\'s name.',
      preconditions: ['ingang', 'gangowner'],
      args: [
        new Argument({
          name: 'gang name',
          key: 'name',
          type: 'string',
          example: 'Cloud9Swags',
          preconditionOptions: [{ length: MAX_NAME }, { minimum: NAME_CHANGE_COST }],
          preconditions: ['maximumlength', 'hasminimumcash', 'notindex'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (NAME_REGEX.test(args.name) || args.name !== args.name.trim()) {
      return msg.createErrorReply(messages.commands.changeGangName.invalid);
    } else if (msg.dbGuild.gangs.some(x => x.name === args.name)) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.changeGangName.taken, args.name
      ));
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === msg.dbGang.name);
    const update = {
      $set: {
        [`gangs.${gangIndex}.name`]: args.name
      }
    };

    await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -NAME_CHANGE_COST);
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.changeGangName.changed, msg.dbGang.name, args.name
    ));
  }
}

module.exports = new ChangeGangName();
