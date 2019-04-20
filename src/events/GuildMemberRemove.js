const Event = require('../structures/Event.js');

class GuildMemberRemoveEvent extends Event {
  async run(member) {
    const gang = await member.dbGang();

    if (!gang) {
      return;
    }

    const { client: { db: { guildRepo } } } = this;
    const dbGuild = await member.guild.dbGuild();
    const gangIndex = dbGuild.gangs.findIndex(x => x.name === gang.name);

    if (gang.leaderId !== member.id) {
      return guildRepo.updateGuild(member.guild.id, {
        $pull: {
          [`gangs.${gangIndex}.members`]: {
            id: member.id
          }
        }
      });
    } else if (gang.members.length) {
      const elders = gang.members.filter(x => x.status === 'elder');
      const newLeader = (elders[0] || gang.members[0]).id;

      await guildRepo.updateGuild(member.guild.id, {
        $pull: {
          [`gangs.${gangIndex}.members`]: {
            id: newLeader
          }
        },
        $set: {
          [`gangs.${gangIndex}.leaderId`]: newLeader
        }
      });
    }

    return guildRepo.updateGuild(member.guild.id, {
      $pull: {
        gangs: {
          name: gang.name
        }
      }
    });
  }
}

module.exports = GuildMemberRemoveEvent;
