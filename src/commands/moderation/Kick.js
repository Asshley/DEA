const { Command, Argument } = require('patron.js');
const {
  COLORS: { KICK: KICK_COLOR }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Kick extends Command {
  constructor() {
    super({
      names: ['kick', 'boot'],
      groupName: 'moderation',
      description: 'Kick any member.',
      botPermissions: ['KICK_MEMBERS'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Slutty Margret#2222"',
          preconditions: ['nomoderator']
        }),
        new Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'bad apple',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await args.member.kick(args.reason);
    await msg.createReply(`you have successfully kicked ${args.member.user.tag}.`);
    await ModerationService.tryInformUser(
      msg.guild, msg.author, 'kicked', args.member.user, args.reason
    );

    return ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.guild,
      action: 'Kick',
      color: KICK_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: args.member.user
    });
  }
}

module.exports = new Kick();
