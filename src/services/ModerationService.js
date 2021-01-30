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
    const dbGuild = await data.guild.dbGuild();

    if (!dbGuild.channels.modLog) {
      return false;
    }

    const channel = data.guild.channels.get(dbGuild.channels.modLog);

    if (!channel) {
      return null;
    }

    const { description, options } = this._formatModLog(
      Object.assign(data, { caseNumber: dbGuild.caseNumber })
    );

    await data.guild.shard.client.db.guildRepo.upsertGuild(data.guild.id, {
      $inc: {
        caseNumber: 1
      }
    });

    return channel.trySendMessage(description, options);
  }

  static _formatModLog(data) {
    const options = {
      color: data.color,
      footer: {
        text: `Case #${data.caseNumber}`,
        icon: 'http://i.imgur.com/BQZJAqT.png'
      },
      timestamp: true
    };

    if (data.moderator) {
      const botLink = `https://discordapp.com/oauth2/authorize\
?client_id=${data.guild.shard.client.user.id}&scope=bot&permissions=8`;

      options.author = {
        name: `${data.moderator.username}#${data.moderator.discriminator}`,
        icon: data.moderator.avatarURL,
        url: botLink
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
