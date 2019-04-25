const { Command, Argument } = require('patron.js');
const {
  DEFAULTS: { MUTE: DEFAULT_MUTE }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const ModerationService = require('../../services/ModerationService.js');
const messages = require('../../../data/messages.json');
const config = require('../../../data/config.json');

class Mute extends Command {
  constructor() {
    super({
      names: ['mute'],
      groupName: 'moderation',
      description: 'Mute any member.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Billy Steve#0711"',
          preconditions: ['nomoderator']
        }),
        new Argument({
          name: 'quantity of hours',
          key: 'hours',
          type: 'float',
          example: '48',
          defaultValue: DEFAULT_MUTE,
          preconditionOptions: [
            {
              minimum: 0, exclusive: true
            }
          ],
          preconditions: ['minimum']
        }),
        new Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          defaultValue: '',
          example: 'was spamming like a chimney',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const role = msg.channel.guild.roles.get(msg.dbGuild.roles.muted);
    const hours = `${args.hours} ${Util.pluralize('hour', args.hours)}`;

    if (!msg.dbGuild.roles.muted) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.mute.noMutedRole, config.prefix
      ));
    } else if (args.member.roles.includes(msg.dbGuild.roles.muted)) {
      return msg.createErrorReply(messages.commands.mute.alreadyMuted);
    }

    if (!role) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.mute.deletedRole, config.prefix
      ));
    }

    await args.member.addRole(role.id);
    await msg.createReply(StringUtil.format(
      messages.commands.mute.success,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`),
      hours
    ));
    await msg._client.db.muteRepo.insertMute(
      args.member.id, msg.channel.guild.id, NumberUtil.hoursToMs(args.hours)
    );
    await ModerationService.tryInformUser(
      msg.channel.guild, msg.author, 'muted', args.member.user, args.reason
    );

    return ModerationService.tryModLog({
      guild: msg.channel.guild,
      action: 'Mute',
      color: config.colors.mute,
      reason: args.reason,
      moderator: msg.author,
      user: args.member.user,
      extraInfoType: 'Length',
      extraInfo: hours
    });
  }
}

module.exports = new Mute();
