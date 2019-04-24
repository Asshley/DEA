class MemberService {
  static async join(member) {
    const { client } = member.guild.shard;
    const dbGuild = await member.guild.dbGuild();
    const isMuted = await client.db.muteRepo.anyMute(member.id, member.guild.id);

    if (dbGuild.roles.muted && isMuted) {
      const role = member.guild.roles.get(dbGuild.roles.muted);
      const clientMember = member.guild.members.get(client.user.id);
      const needPerms = !role || role.position >= clientMember.highestRole.position
        || !clientMember.permission.has('manageRoles');

      if (needPerms) {
        return;
      }

      return member.addRole(dbGuild.roles.muted);
    }
  }
}

module.exports = MemberService;
