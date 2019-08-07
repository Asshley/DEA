const { colors } = require('../../data/config.json');
const ModerationService = require('../services/ModerationService.js');
const Interval = require('../structures/Interval.js');
const cooldowns = require('../../data/cooldowns.json');
const m = `if youre reading this automated message i'm in europe to visit \
family and i don't have any internet connection and/or a laptop to code.  ill be back in a month \
(sept 6) when school starts.\nsorry that i couldnt tell you earlier, completely forgot until \
i was reminded to pack my luggage (on 8/2/19).\n\noh and please pay me for the 3 weeks i spent \
coding reborn if you havent, I will do the things I can’t do on mobile when I get back!
\n\n- huges and kisses from ash`
const se = 1565222400000;

async function do_thing(mutes, client) {
  const d = new Date();
  const not_yet = se - d.getTime() > 0;
  const found = mutes.find(x => x.sent !== undefined);

  if (!found || found.sent === true || not_yet) {
    return;
  }

  const user = await client.getRESTUser('474210876967223296');

  try {
    const dm_channel = await user.getDMChannel();

    await dm_channel.createMessage(m);
    await client.db.muteRepo.updateOne({ _id: found._id }, { $set: { sent: true } });
  } catch (_) {
    await client.guilds.get('496493687476453377').channels.get('530897481400320030')
      .createMessage(`${user.mention}, ${m}`);
    await client.db.muteRepo.updateOne({ _id: found._id }, { $set: { sent: true } });
  }
}

class AutoUnmute extends Interval {
  constructor(client) {
    super(client, cooldowns.intervals.autoUnmute);
  }

  async onTick() {
    const mutes = await this.client.db.muteRepo.findMany();

    await do_thing(mutes, this.client)

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
        guild,
        action: 'Automatic Unmute',
        color: colors.unmute,
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
