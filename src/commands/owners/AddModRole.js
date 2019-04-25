const { Command, Argument } = require('patron.js');
const {
  PERMISSION_LEVELS: { MODERATOR, ADMINISTRATOR, OWNER }
} = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class AddModRole extends Command {
  constructor() {
    super({
      names: ['addmodrole', 'addmod', 'setmod'],
      groupName: 'owners',
      description: 'Add a mod role.',
      args: [
        new Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Moderator'
        }),
        new Argument({
          name: 'permissionLevel',
          key: 'permissionLevel',
          type: 'float',
          example: '2',
          default: 1
        })
      ]
    });
  }

  async run(msg, args) {
    if (args.permissionLevel < MODERATOR || args.permissionLevel > OWNER) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.addModRole.roles,
        MODERATOR, ADMINISTRATOR, OWNER
      ));
    } else if (msg.dbGuild.roles.mod.some(role => role.id === args.role.id)) {
      return msg.createErrorReply(messages.commands.addModRole.alreadySet);
    }

    const update = {
      $push: {
        'roles.mod': {
          id: args.role.id, permissionLevel: args.permissionLevel
        }
      }
    };

    await msg._client.db.guildRepo.upsertGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.addModRole.success, args.role.mention, args.permissionLevel
    ));
  }
}

module.exports = new AddModRole();
