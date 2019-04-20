const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { GANG: { NAME: MAX_NAME } },
  REGEXES: { GANG_NAME: NAME_REGEX },
  RESTRICTIONS: { COMMANDS: { GANG: { NAME_CHANGE_COST } } },
  MESSAGES: { GANG }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');

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
    if (NAME_REGEX.test(args.name) || args.name.startsWith(' ') || args.name.endsWith(' ')) {
      return msg.createErrorReply(GANG.INVALID_NAME);
    } else if (msg.dbGuild.gangs.some(x => x.name === args.name)) {
      return msg.createErrorReply(StringUtil.format(GANG.USED_NAME, args.name));
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === msg.dbGang.name);
    const update = {
      $set: {
        [`gangs.${gangIndex}.name`]: args.name
      }
    };

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -NAME_CHANGE_COST);
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(StringUtil.format(GANG.CHANGED_NAME, msg.dbGang.name, args.name));
  }
}

module.exports = new ChangeGangName();
