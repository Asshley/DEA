const { LINKS } = require('../utility/Constants.js');
const StringUtil = require('../utility/StringUtil.js');

class ModerationService {
  static getPermLevel(dbGuild, member) {
    if (member.guild.ownerID === member.id) {
      return this.PERMISSION_LEVELS.OWNER;
    }

    const roles = dbGuild.roles.mod.sort((a, b) => a.permissionLevel - b.permissionLevel);
    let permLevel = 0;

    for (let i = 0; i < roles.length; i++) {
      if (member.guild.roles.has(roles[i].id) && member.roles.has(roles[i].id)) {
        permLevel = roles[i].permissionLevel;
      }
    }

    return member.hasPermission('ADMINISTRATOR') && permLevel
      < this.PERMISSION_LEVELS.ADMINISTRATOR ? this.PERMISSION_LEVELS.ADMINISTRATOR : permLevel;
  }

  static tryInformUser(guild, moderator, action, user, reason = '') {
    return user.tryDM(`${StringUtil.boldify(moderator.tag)} has ${action} you${StringUtil
      .isNullOrWhiteSpace(reason) ? '.' : ` for the following reason: ${reason}.`}`, { guild });
  }

  static async tryModLog(data) {
    if (!data.dbGuild.channels.modLog) {
      return false;
    }

    const channel = data.guild.channels.get(data.dbGuild.channels.modLog);

    if (!channel) {
      return false;
    }

    const { description, options } = this._formatModLog(data, data.dbGuild);
    const update = {
      $inc: {
        'misc.caseNumber': 1
      }
    };

    await data.guild.client.db.guildRepo.upsertGuild(data.guild.id, update);

    return channel.tryCreateMessage(description, options);
  }

  static _formatModLog(data, dbGuild) {
    const options = {
      color: data.color,
      footer: {
        text: `Case #${dbGuild.misc.caseNumber}`,
        icon: 'http://i.imgur.com/BQZJAqT.png'
      },
      timestamp: true
    };

    if (data.moderator) {
      options.author = {
        name: data.moderator.tag,
        icon: data.moderator.displayAvatarURL(),
        URL: LINKS.BOT
      };
    }

    let description = `**Action:** ${data.action}\n`;

    if (!StringUtil.isNullOrWhiteSpace(data.extraInfoType)) {
      description += `**${data.extraInfoType}:** ${data.extraInfo}\n`;
    }

    if (data.user) {
      description += `**User:** ${data.user.tag} (${data.user.id})\n`;
    }

    if (!StringUtil.isNullOrWhiteSpace(data.reason)) {
      description += `**Reason:** ${data.reason}\n`;
    }

    return {
      description,
      options
    };
  }
}
ModerationService.PERMISSION_LEVELS = {
  OWNER: 3,
  ADMINISTRATOR: 2,
  MODERATOR: 1
};

module.exports = ModerationService;
