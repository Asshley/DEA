const { Command, Argument } = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');
const config = require('../../../data/config.json');

class Unmute extends Command {
  constructor() {
    super({
      names: ['unmute'],
      groupName: 'moderation',
      description: 'Unmute any member.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Jimmy Johnson#3636"'
        }),
        new Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          defaultValue: '',
          example: 'bribed me 50k',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (!msg.dbGuild.roles.muted) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.unmute.noMutedRole, config.prefix
      ));
    } else if (!args.member.roles.includes(msg.dbGuild.roles.muted)) {
      return msg.createErrorReply(messages.commands.unmute.notMuted);
    }

    const role = msg.channel.guild.roles.get(msg.dbGuild.roles.muted);

    if (!role) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.unmute.deleteRole, config.prefix
      ));
    }

    await args.member.removeRole(role.id);
    await msg._client.db.muteRepo.deleteMute(args.member.id, msg.channel.guild.id);
    await msg.createReply(StringUtil.format(
      messages.commands.unmute.success,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`)
    ));
    await ModerationService.tryInformUser(
      msg.channel.guild, msg.author, 'unmuted', args.member.user, args.reason
    );

    return ModerationService.tryModLog({
      guild: msg.channel.guild,
      action: 'Unmute',
      color: config.colors.unmute,
      reason: args.reason,
      moderator: msg.author,
      user: args.member.user
    });
  }
}

module.exports = new Unmute();
