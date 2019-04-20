const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { GANG: { NAME: MAX_NAME, PER_GUILD } },
  REGEXES: { GANG_NAME: NAME_REGEX },
  RESTRICTIONS: { COMMANDS: { GANG: { CREATION_COST } } },
  MESSAGES: { GANG }
} = require('../../utility/Constants.js');
const Gang = require('../../structures/Gang.js');
const StringUtil = require('../../utility/StringUtil.js');

class CreateGang extends Command {
  constructor() {
    super({
      names: ['creategang', 'makegang'],
      groupName: 'gangs',
      description: 'Create a gang.',
      preconditions: ['notingang'],
      args: [
        new Argument({
          name: 'gang name',
          key: 'name',
          type: 'string',
          example: 'Cloud9Swags',
          preconditionOptions: [{ length: MAX_NAME }, { minimum: CREATION_COST }],
          preconditions: ['maximumlength', 'hasminimumcash', 'notindex'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbGuild.gangs.length >= PER_GUILD) {
      return msg.createErrorReply(StringUtil.format(GANG.MAX_GANGS, PER_GUILD));
    } else if (NAME_REGEX.test(args.name) || args.name.startsWith(' ') || args.name.endsWith(' ')) {
      return msg.createErrorReply(GANG.INVALID_NAME);
    } else if (msg.dbGuild.gangs.some(x => x.name === args.name)) {
      return msg.createErrorReply(GANG.USED_NAME);
    }

    const index = Gang.getEmptyIndex(msg.dbGuild);
    const gang = new Gang({
      index,
      leaderId: msg.author.id,
      name: args.name,
      wealth: 0,
      vault: {},
      members: []
    });
    const update = {
      $push: {
        gangs: gang.data
      }
    };

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -CREATION_COST);
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(
      StringUtil.format(GANG.CREATED_GANG, StringUtil.boldify(args.name))
    );
  }
}

module.exports = new CreateGang();
