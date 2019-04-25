const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class SetMutedRole extends Command {
  constructor() {
    super({
      names: ['setmutedrole', 'setmuterole', 'setmute', 'setmuted'],
      groupName: 'administration',
      description: 'Sets the muted role.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Muted',
          preconditions: ['hierarchy'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const update = {
      $set: {
        'roles.muted': args.role.id
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(
      StringUtil.format(messages.commands.setMutedRole, args.role.mention)
    );
  }
}

module.exports = new SetMutedRole();
