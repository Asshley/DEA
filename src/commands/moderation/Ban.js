const { Command, Argument } = require('patron.js');
const {
  COLORS: { BAN: BAN_COLOR }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class Ban extends Command {
  constructor() {
    super({
      names: [
        'ban',
        'hammer',
        'nuke',
        'snap',
        'clap',
        'meme',
        'pound'
      ],
      groupName: 'moderation',
      description: 'Swing the ban hammer on any member.',
      botPermissions: ['BAN_MEMBERS'],
      args: [
        new Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: '"Chimney Up My Ass#0007"'
        }),
        new Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'terrible apple',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const member = msg.channel.guild.members.get(args.user.id);

    if (member && this.constructor.canBan(member)) {
      const userPerm = ModerationService.getPermLevel(msg.dbGuild, member);
      const authorPerm = ModerationService.getPermLevel(msg.dbGuild, msg.member);

      if (userPerm >= authorPerm) {
        return msg.createErrorReply(messages.commands.ban.permLevel);
      }

      await ModerationService.tryInformUser(
        msg.channel.guild, msg.author, 'banned', args.user, args.reason
      );
    }

    await msg.channel.guild.banMember(args.user.id);
    await msg.createReply(StringUtil.format(
      messages.commands.ban.success,
      StringUtil.boldify(`${args.user.username}#${args.user.discriminator}`)
    ));

    return ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.channel.guild,
      action: 'Ban',
      color: BAN_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: args.user
    });
  }

  static canBan(member) {
    const clientMember = member.guild.members.get(member.guild.shard.client.user.id);

    return member.id !== clientMember.id
      && member.id !== member.guild.ownerID
      && clientMember.highestRole.position > member.highestRole.position;
  }
}

module.exports = new Ban();
