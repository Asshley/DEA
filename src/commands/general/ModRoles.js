const { Command } = require('patron.js');
const {
  PERMISSION_LEVELS: { MODERATOR, ADMINISTRATOR, OWNER }
} = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class ModRoles extends Command {
  constructor() {
    super({
      names: ['modroles', 'modrole'],
      groupName: 'general',
      description: 'View all mod roles in this server.'
    });
  }

  async run(msg) {
    const roles = msg.dbGuild.roles.mod
      .sort((a, b) => a.permissionLevel - b.permissionLevel);

    if (!roles.length) {
      return msg.createErrorReply(messages.commands.modRoles.none);
    }

    let description = '';

    for (let i = 0; i < roles.length; i++) {
      const rank = msg.channel.guild.roles.get(roles[i].id);

      description += `${rank}: ${roles[i].permissionLevel}\n`;
    }

    return msg.channel.sendMessage(StringUtil.format(
      messages.commands.modRoles.mesage,
      description,
      MODERATOR,
      ADMINISTRATOR,
      OWNER
    ), { title: 'Mod Roles' });
  }
}

module.exports = new ModRoles();
