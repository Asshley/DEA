const { COLORS, COOLDOWNS } = require('../utility/Constants.js');
const ModerationService = require('../services/ModerationService.js');
const Interval = require('../structures/Interval.js');

class AutoUnmute extends Interval {
  constructor(client) {
    super(client, COOLDOWNS.AUTO_UNMUTE);
  }

  async onTick() {
    const mutes = await this.client.db.muteRepo.findMany();

    for (let i = 0; i < mutes.length; i++) {
      if (mutes[i].mutedAt + mutes[i].muteLength > Date.now()) {
        continue;
      }

      await this.client.db.muteRepo.deleteById(mutes[i]._id);

      const guild = this.client.guilds.get(mutes[i].guildId);

      if (!guild) {
        continue;
      }

      const member = guild.member(mutes[i].userId);

      if (!member) {
        continue;
      }

      const dbGuild = await guild.dbGuild();
      const role = guild.roles.get(dbGuild.roles.muted);
      const ignore = !role || !member.roles.has(dbGuild.roles.muted) || !guild.me
        .hasPermission('MANAGE_ROLES') || role.position >= guild.me.roles.highest.position;

      if (ignore) {
        continue;
      }

      await member.roles.remove(role);
      await ModerationService.tryModLog({
        dbGuild,
        guild,
        action: 'Automatic Unmute',
        color: COLORS.UNMUTE,
        reason: '',
        moderator: null,
        user: member.user
      });

      return ModerationService
        .tryInformUser(guild, this.client.user, 'automatically unmuted', member.user);
    }
  }
}

module.exports = AutoUnmute;
