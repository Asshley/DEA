const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Event = require('../structures/Event.js');

class ChannelDelete extends Event {
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
    const { client } = channel.guild.shard;

    if (dbGuild.channels.gamble.includes(channel.id)) {
      await client.db.guildRepo.updateGuild(channel.guild.id, update('channels.gamble'));
    }

    if (dbGuild.channels.ignore.includes(channel.id)) {
      await client.db.guildRepo.updateGuild(channel.guild.id, update('channels.ignore'));
    }
  }
}
ChannelDelete.EVENT_NAME = CLIENT_EVENTS.CHANNEL_DELETE;

module.exports = ChannelDelete;
