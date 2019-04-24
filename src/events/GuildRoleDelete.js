const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Event = require('../structures/Event.js');

class GuildRoleDelete extends Event {
  async run(_, role) {
    const dbGuild = await role.guild.dbGuild();
    const { client } = role.guild.shard;

    if (dbGuild.roles.rank.some(v => v.id === role.id)) {
      return client.db.guildRepo.upsertGuild(role.guild.id, {
        $pull: {
          'roles.rank': {
            id: role.id
          }
        }
      });
    }

    if (dbGuild.roles.mod.some(v => v.id === role.id)) {
      return client.db.guildRepo.upsertGuild(role.guild.id, {
        $pull: {
          'roles.mod': {
            id: role.id
          }
        }
      });
    }
  }
}
GuildRoleDelete.EVENT_NAME = CLIENT_EVENTS.GUILD_ROLE_DELETE;

module.exports = GuildRoleDelete;
