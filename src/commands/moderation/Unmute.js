const { Command, Argument } = require('patron.js');
const {
  PREFIX,
  COLORS: { UNMUTE: { UNMUTE_COLOR } }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

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
      return msg.createErrorReply(`you must set a muted role with the \`${PREFIX}setmute @Role\` \
command before you can unmute users.`);
    } else if (!args.member.roles.has(msg.dbGuild.roles.muted)) {
      return msg.createErrorReply('this user is not muted.');
    }

    const role = msg.guild.roles.get(msg.dbGuild.roles.muted);

    if (!role) {
      return msg.createErrorReply(`the set muted role has been deleted. Please set a new one with \
the \`${PREFIX}setmute Role\` command.`);
    }

    await args.member.roles.remove(role);
    await msg.client.db.muteRepo.deleteMute(args.member.id, msg.guild.id);
    await msg.createReply(`you have successfully unmuted ${args.member.user.tag}.`);
    await ModerationService.tryInformUser(
      msg.guild, msg.author, 'unmuted', args.member.user, args.reason
    );

    return ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.guild,
      action: 'Unmute',
      color: UNMUTE_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: args.member.user
    });
  }
}

module.exports = new Unmute();
