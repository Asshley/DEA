const { Command, Argument } = require('patron.js');
const {
  COLORS: { UNBAN: UNBAN_COLOR }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

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
    await msg.guild.members.unban(args.user);
    await msg.createReply(`you have successfully unbanned ${args.user.tag}.`);
    await ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.guild,
      action: 'Unban',
      color: UNBAN_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: args.user
    });

    return ModerationService.tryInformUser(
      msg.guild, msg.author, 'unbanned', args.user, args.reason
    );
  }
}

module.exports = new Unban();
