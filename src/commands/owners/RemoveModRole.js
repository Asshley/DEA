const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.removeModRole.noRole);
    }

    const update = {
      $pull: {
        'roles.mod': {
          id: args.role.id
        }
      }
    };

    await msg._client.db.guildRepo.upsertGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.removeModRole.success, args.role.mention
    ));
  }
}

module.exports = new RemoveModRole();
