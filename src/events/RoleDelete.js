const Event = require('../structures/Event.js');

class RoleDeleteEvent extends Event {
  async run(role) {
    const dbGuild = await role.guild.dbGuild();
    const update = x => ({
      $pull: {
        [x]: {
          id: role.id
        }
      }
    });

    if (dbGuild.roles.rank.some(v => v.id === role.id)) {
      return role.client.db.guildRepo.upsertGuild(role.guild.id, update('roles.rank'));
    }

    if (dbGuild.roles.mod.some(v => v.id === role.id)) {
      return role.client.db.guildRepo.upsertGuild(role.guild.id, update('roles.mod'));
    }
  }
}
RoleDeleteEvent.eventName = 'roleDelete';

module.exports = RoleDeleteEvent;
