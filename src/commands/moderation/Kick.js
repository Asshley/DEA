const { Command, Argument } = require('patron.js');
const {
  COLORS: { KICK: KICK_COLOR }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class Kick extends Command {
  constructor() {
    super({
      names: ['kick', 'boot'],
      groupName: 'moderation',
      description: 'Kick any member.',
      botPermissions: ['KICK_MEMBERS'],
      postconditions: ['modabuse'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Slutty Margret#2222"',
          preconditions: ['nomoderator', 'kickable']
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
    await ModerationService.tryInformUser(
      msg.channel.guild, msg.author, 'kicked', args.member.user, args.reason
    );
    await args.member.kick();
    await msg.createReply(StringUtil.format(
      messages.commands.kick,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`)
    ));

    return ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.channel.guild,
      action: 'Kick',
      color: KICK_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: args.member.user
    });
  }
}

module.exports = new Kick();
