const NumberUtil = require('../utility/NumberUtil.js');

class RankService {
  static handle(dbUser, dbGuild, member) {
    if (!member.guild.me.hasPermission('MANAGE_ROLES')) {
      return;
    }

    const highsetRolePosition = member.guild.me.roles.highest.position;
    const rolesToAdd = [];
    const rolesToRemove = [];
    const cash = NumberUtil.value(dbUser.cash);
    const { roles: { rank: guildRoles } } = dbGuild;

    for (let i = 0; i < guildRoles.length; i++) {
      const role = member.guild.roles.get(guildRoles[i].id);

      if (!role || role.position > highsetRolePosition) {
        continue;
      }

      if (!member.roles.has(role.id) && cash >= guildRoles[i].cashRequired) {
        rolesToAdd.push(role);
      } else if (cash < guildRoles[i].cashRequired) {
        rolesToRemove.push(role);
      }
    }

    if (rolesToAdd.length) {
      return member.roles.add(rolesToAdd);
    } else if (rolesToRemove.length) {
      return member.roles.remove(rolesToRemove);
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
