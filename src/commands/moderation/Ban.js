const { Command, Argument } = require('patron.js');
const {
  COLORS: { BAN: BAN_COLOR }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Ban extends Command {
  constructor() {
    super({
      names: [
        'ban',
        'hammer',
        'nuke',
        'snap',
        'clap',
        'meme'
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
    if (msg.guild.members.has(args.user.id) && msg.guild.member(args.user.id).bannable) {
      const userPerm = ModerationService.getPermLevel(msg.dbGuild, msg.guild.member(args.user));
      const authorPerm = ModerationService.getPermLevel(msg.dbGuild, msg.member);

      if (userPerm >= authorPerm) {
        return msg.createErrorReply('you cannot ban someone with the same or \
higher permission level.');
      }

      await ModerationService.tryInformUser(
        msg.guild, msg.author, 'banned', args.user, args.reason
      );
    }

    await msg.guild.members.ban(args.user);
    await msg.createReply(`you have successfully banned ${args.user.tag}.`);

    return ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.guild,
      action: 'Ban',
      color: BAN_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: args.user
    });
  }
}

module.exports = new Ban();
