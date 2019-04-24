const { BOT_LINK } = require('../utility/Constants.js');
const StringUtil = require('../utility/StringUtil.js');

class ModerationService {
  static getPermLevel(dbGuild, member) {
    if (member.guild.ownerID === member.id) {
      return this.PERMISSION_LEVELS.OWNER;
    }

    const roles = dbGuild.roles.mod.sort((a, b) => a.permissionLevel - b.permissionLevel);
    let permLevel = 0;

    for (let i = 0; i < roles.length; i++) {
      if (member.guild.roles.has(roles[i].id) && member.roles.includes(roles[i].id)) {
        permLevel = roles[i].permissionLevel;
      }
    }

    return member.permission.has('administrator') && permLevel
      < this.PERMISSION_LEVELS.ADMINISTRATOR ? this.PERMISSION_LEVELS.ADMINISTRATOR : permLevel;
  }

  static tryInformUser(guild, moderator, action, user, reason = '') {
    return user.tryDM(`${StringUtil.boldify(`${moderator.username}#${moderator.discriminator}`)} \
has ${action} you${StringUtil.isNullOrWhiteSpace(reason) ? '.' : ` for the following \
reason: ${reason}.`}`, { guild });
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
        caseNumber: 1
      }
    };

    await data.guild.shard.client.db.guildRepo.upsertGuild(data.guild.id, update);

    return channel.trySendMessage(description, options);
  }

  static _formatModLog(data, dbGuild) {
    const options = {
      color: data.color,
      footer: {
        text: `Case #${dbGuild.caseNumber}`,
        icon: 'http://i.imgur.com/BQZJAqT.png'
      },
      timestamp: true
    };

    if (data.moderator) {
      options.author = {
        name: `${data.moderator.username}#${data.moderator.discriminator}`,
        icon: data.moderator.avatarURL,
        URL: BOT_LINK
      };
    }

    let description = `**Action:** ${data.action}\n`;

    if (!StringUtil.isNullOrWhiteSpace(data.extraInfoType)) {
      description += `**${data.extraInfoType}:** ${data.extraInfo}\n`;
    }

    if (data.user) {
      description += `**User:** ${data.user.username}#${data.user.discriminator} \
(${data.user.id})\n`;
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
