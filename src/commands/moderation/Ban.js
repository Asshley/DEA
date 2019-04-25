const { Command, CommandResult, Argument } = require('patron.js');
const { colors } = require('../../../data/config.json');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
      postconditions: ['modabuse'],
      args: [
        new Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: '"Chimney Up My Ass#0007"',
          preconditions: ['bannable']
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

    if (member) {
      const userPerm = ModerationService.getPermLevel(msg.dbGuild, member);
      const authorPerm = ModerationService.getPermLevel(msg.dbGuild, msg.member);

      if (userPerm >= authorPerm) {
        return CommandResult.fromError(messages.commands.ban.permLevel);
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
      guild: msg.channel.guild,
      action: 'Ban',
      color: colors.ban,
      reason: args.reason,
      moderator: msg.author,
      user: args.user
    });
  }
}

module.exports = new Ban();
