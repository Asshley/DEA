const NumberUtil = require('../utility/NumberUtil.js');

class RankService {
  static handle(dbUser, dbGuild, member) {
    const clientMember = member.guild.members.get(member.guild.shard.client.user.id);

    if (!clientMember.permission.has('manageRoles')) {
      return;
    }

    const highsetRolePosition = clientMember.highestRole.position;
    const rolesToAdd = [];
    const rolesToRemove = [];
    const cash = NumberUtil.value(dbUser.cash);
    const { roles: { rank: guildRoles } } = dbGuild;

    for (let i = 0; i < guildRoles.length; i++) {
      const role = member.guild.roles.get(guildRoles[i].id);

      if (!role || role.position > highsetRolePosition) {
        continue;
      }

      if (!member.roles.includes(role.id) && cash >= guildRoles[i].cashRequired) {
        rolesToAdd.push(role.id);
      } else if (cash < guildRoles[i].cashRequired) {
        rolesToRemove.push(role.id);
      }
    }

    if (rolesToAdd.length) {
      return member.edit({
        roles: [...member.roles, ...rolesToAdd]
      });
    } else if (rolesToRemove.length) {
      return member.edit({
        roles: member.roles.filter(x => !rolesToRemove.includes(x))
      });
    }
  }

  static getRank(dbUser, dbGuild, guild) {
    const cash = NumberUtil.value(dbUser.cash);
    const ranks = dbGuild.roles.rank.sort((a, b) => a.cashRequired - b.cashRequired);
    let role;

    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];

      if (cash >= rank.cashRequired) {
        role = guild.roles.get(rank.id);
      }
    }

    return role;
  }
}

module.exports = RankService;
