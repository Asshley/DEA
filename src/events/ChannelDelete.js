const Event = require('../structures/Event.js');

class ChannelDeleteEvent extends Event {
  async run(channel) {
    const { guild } = channel;

    if (!guild) {
      return;
    }

    const dbGuild = await guild.dbGuild();
    const update = x => ({
      $pull: {
        [x]: channel.id
      }
    });

    if (dbGuild.channels.gamble.includes(channel.id)) {
      await channel.client.db.guildRepo.updateGuild(channel.guild.id, update('channels.gamble'));
    }

    if (dbGuild.channels.ignore.includes(channel.id)) {
      await channel.client.db.guildRepo.updateGuild(channel.guild.id, update('channels.ignore'));
    }
  }
}
ChannelDeleteEvent.eventName = 'channelDelete';

module.exports = ChannelDeleteEvent;
