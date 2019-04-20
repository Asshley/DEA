const { Command, Argument } = require('patron.js');
const {
  COLORS: { CHILL: CHILL_COLOR }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Thaw extends Command {
  constructor() {
    super({
      names: ['thaw'],
      groupName: 'moderation',
      description: 'Thaws the channel.',
      botPermissions: ['MANAGE_CHANNELS'],
      args: [
        new Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'needed to be thawed',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const defaultPerms = msg.channel.permissionsFor(msg.guild.id);

    if (defaultPerms.has('SEND_MESSAGES')) {
      return msg.createErrorReply('this channel is already thawed.');
    }

    await msg.channel.updateOverwrite(msg.guild.id, {
      SEND_MESSAGES: null,
      ADD_REACTIONS: null
    });
    await msg.createReply('the channel has been thawed.');

    return ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.guild,
      action: 'Thaw',
      color: CHILL_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: null,
      extraInfoType: 'Channel',
      extraInfo: `${msg.channel.name} (${msg.channel})`
    });
  }
}

module.exports = new Thaw();
