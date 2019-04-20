const { Command, Argument } = require('patron.js');

class RemoveModRole extends Command {
  constructor() {
    super({
      names: ['removemodrole', 'removemod'],
      groupName: 'owners',
      description: 'Remove a mod role.',
      args: [
        new Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Moderator',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (!msg.dbGuild.roles.mod.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('you may not remove a moderation role that has no been set.');
    }

    const update = {
      $pull: {
        'roles.mod': {
          id: args.role.id
        }
      }
    };

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully removed the mod role ${args.role}.`);
  }
}

module.exports = new RemoveModRole();
