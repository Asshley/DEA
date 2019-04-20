const { Command, Argument } = require('patron.js');
const {
  PERMISSION_LEVELS: { MODERATOR, ADMINISTRATOR, OWNER }
} = require('../../services/ModerationService.js');

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
      return msg.createErrorReply(`permission levels:\nModerator: ${MODERATOR}
Administrator: ${ADMINISTRATOR}\nOwner: ${OWNER}`);
    } else if (msg.dbGuild.roles.mod.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('this moderation role has already been set.');
    }

    const update = {
      $push: {
        'roles.mod': {
          id: args.role.id, permissionLevel: args.permissionLevel
        }
      }
    };

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully added the mod role ${args.role} with \
a permission level of ${args.permissionLevel}.`);
  }
}

module.exports = new AddModRole();
