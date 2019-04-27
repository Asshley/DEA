const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { GANG: { NAME: MAX_NAME, PER_GUILD } },
  REGEXES: { GANG_NAME: NAME_REGEX },
  RESTRICTIONS: { COMMANDS: { GANG: { CREATION_COST } } }
} = require('../../utility/Constants.js');
const GangUtil = require('../../utility/GangUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
      return msg.createErrorReply(StringUtil.format(messages.commands.createGang.max, PER_GUILD));
    } else if (NAME_REGEX.test(args.name) || args.name !== args.name.trim()) {
      return msg.createErrorReply(messages.commands.createGang.invalid);
    } else if (msg.dbGuild.gangs.some(x => x.name === args.name)) {
      return msg.createErrorReply(messages.commands.createGang.taken);
    }

    const gang = GangUtil.from({
      index: GangUtil.getEmptyIndex(msg.dbGuild),
      leaderId: msg.author.id,
      name: args.name
    });
    const update = {
      $push: {
        gangs: gang
      }
    };

    await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -CREATION_COST);
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.createGang.created, args.name
    ));
  }
}

module.exports = new CreateGang();
