const Eris = require('eris');
const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Event = require('../structures/Event.js');

class GuildMemberRemove extends Event {
  async run(_, member) {
    if (member.constructor.name !== Eris.Member.constructor.name) {
      return;
    }

    const gang = await member.dbGang();

    if (!gang) {
      return;
    }

    const { emitter: { db: { guildRepo } } } = this;
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
GuildMemberRemove.EVENT_NAME = CLIENT_EVENTS.GUILD_MEMBER_REMOVE;

module.exports = GuildMemberRemove;
