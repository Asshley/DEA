const { COLORS } = require('../utility/Constants.js');
const ModerationService = require('../services/ModerationService.js');
const Interval = require('../structures/Interval.js');
const cooldowns = require('../../data/cooldowns.json');

class AutoUnmute extends Interval {
  constructor(client) {
    super(client, cooldowns.intervals.autoUnmute);
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

      const member = guild.members.get(mutes[i].userId);

      if (!member) {
        continue;
      }

      const dbGuild = await guild.dbGuild();
      const role = guild.roles.get(dbGuild.roles.muted);
      const ignore = !role || !member.roles.includes(dbGuild.roles.muted)
        || !guild.members.get(this.client.user.id).permission.has('manageRoles')
        || role.position >= guild.members.get(this.client.user.id).highestRole.position;

      if (ignore) {
        continue;
      }

      await member.removeRole(role.id);
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
