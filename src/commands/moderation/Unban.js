const { Command, Argument } = require('patron.js');
const { colors } = require('../../../data/config.json');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Unban extends Command {
  constructor() {
    super({
      names: ['unban', 'unclap'],
      groupName: 'moderation',
      description: 'Lift the ban hammer on any member.',
      botPermissions: ['BAN_MEMBERS'],
      args: [
        new Argument({
          name: 'user',
          key: 'user',
          type: 'banneduser',
          example: '"Jimmy Steve#8686"'
        }),
        new Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'mb he was actually a good apple',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.channel.guild.unbanMember(args.user.id);
    await msg.createReply(StringUtil.format(
      messages.commands.unban,
      StringUtil.boldify(`${args.user.username}#${args.user.discriminator}`)
    ));
    await ModerationService.tryModLog({
      guild: msg.channel.guild,
      action: 'Unban',
      color: colors.unban,
      reason: args.reason,
      moderator: msg.author,
      user: args.user
    });

    return ModerationService.tryInformUser(
      msg.channel.guild, msg.author, 'unbanned', args.user, args.reason
    );
  }
}

module.exports = new Unban();
