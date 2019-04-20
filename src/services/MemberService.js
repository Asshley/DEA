class MemberService {
  static async join(member) {
    const dbGuild = await member.guild.dbGuild();
    const isMuted = await member.client.db.muteRepo.anyMute(member.id, member.guild.id);

    if (dbGuild.roles.muted && isMuted) {
      const role = member.guild.roles.get(dbGuild.roles.muted);
      const ignore = !role || !member.guild.me.hasPermission('MANAGE_ROLES')
        || role.position >= member.guild.me.roles.highest.position;

      if (ignore) {
        return;
      }

      return member.roles.add(role);
    }
  }
}

module.exports = MemberService;
