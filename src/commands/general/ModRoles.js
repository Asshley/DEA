const { Command } = require('patron.js');
const {
  PERMISSION_LEVELS: { MODERATOR, ADMINISTRATOR, OWNER }
} = require('../../services/ModerationService.js');

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
      return msg.createErrorReply('there are no mod roles yet.');
    }

    let description = '';

    for (let i = 0; i < roles.length; i++) {
      const rank = msg.guild.roles.get(roles[i].id);

      description += `${rank}: ${roles[i].permissionLevel}\n`;
    }

    return msg.channel.createMessage(`${description}\n**Permission Levels:**
${MODERATOR}: Moderator\n${ADMINISTRATOR}: Administrator\n${OWNER}: Owner`, { title: 'Mod Roles' });
  }
}

module.exports = new ModRoles();
