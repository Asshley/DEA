const { Command, Argument } = require('patron.js');
const {
  COLORS: { MUTE: MUTE_COLOR },
  DEFAULTS: { MUTE: DEFAULT_MUTE }, PREFIX
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Util = require('../../utility/Util.js');
const ModerationService = require('../../services/ModerationService.js');

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
          preconditionOptions: [{ minimum: 0.000001 }],
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
    const role = msg.guild.roles.get(msg.dbGuild.roles.muted);
    const hours = `${args.hours} ${Util.pluralize('hour', args.hours)}`;

    if (!msg.dbGuild.roles.muted) {
      return msg.createErrorReply(`you must set a muted role with the \`${PREFIX}setmute @Role\` \
command before you can mute users.`);
    } else if (args.member.roles.has(msg.dbGuild.roles.muted)) {
      return msg.createErrorReply('this user is already muted.');
    }

    if (!role) {
      return msg.createErrorReply(`rhe set muted role has been deleted. Please set a new one with \
the \`${PREFIX}setmute Role\` command.`);
    }

    await args.member.roles.add(role);
    await msg.createReply(`you have successfully muted ${args.member.user.tag} for ${hours}.`);
    await msg.client.db.muteRepo.insertMute(
      args.member.id, msg.guild.id, NumberUtil.hoursToMs(args.hours)
    );
    await ModerationService.tryInformUser(
      msg.guild, msg.author, 'muted', args.member.user, args.reason
    );

    return ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.guild,
      action: 'Mute',
      color: MUTE_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: args.member.user,
      extraInfoType: 'Length',
      extraInfo: hours
    });
  }
}

module.exports = new Mute();
