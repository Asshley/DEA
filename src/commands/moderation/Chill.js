const { Command, Argument } = require('patron.js');
const {
  DEFAULTS: { CHILL: DEFAULT_CHILL },
  RESTRICTIONS: { COMMANDS: { CHILL } },
  COLORS: { CHILL: CHILL_COLOR }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const PromiseUtil = require('../../utility/PromiseUtil.js');
const TO_SECONDS = 1e3;

class Chill extends Command {
  constructor() {
    super({
      names: ['chill', 'freeze', 'ZA_WARUDO'],
      groupName: 'moderation',
      description: 'Chills the channel, disabling everyone\'s permission to send messages.',
      botPermissions: ['MANAGE_CHANNELS'],
      args: [
        new Argument({
          name: 'time',
          key: 'time',
          type: 'int',
          example: '5',
          preconditionOptions: [{ minimum: CHILL.MINIMUM_TIME }, { maximum: CHILL.MAXIMUM_TIME }],
          preconditions: ['minimum', 'maximum'],
          defaultValue: DEFAULT_CHILL
        }),
        new Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'one of the apples was spamming like an orange.',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const defaultPerms = msg.channel.permissionOverwrites.get(msg.guild.id);
    const { deny, allow } = defaultPerms;

    if (defaultPerms && deny.has('SEND_MESSAGES') && !allow.has('SEND_MESSAGES')) {
      return msg.createErrorReply('this channel is already chilled.');
    }

    const time = args.time.toLocaleString();

    await ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.guild,
      action: 'Chill',
      color: CHILL_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: null,
      extraInfoType: 'Duration',
      extraInfo: `${time} seconds\n**Channel:** ${msg.channel.name} (${msg.channel})`
    });
    await msg.channel.updateOverwrite(msg.guild.id, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false
    });
    await msg.createReply(
      `Time, stop! (the channel has been chilled and won't be heated up until ${time} seconds have passed)`
    );
    await PromiseUtil.delay(args.time * TO_SECONDS);

    if (!msg.channel.permissionsFor(msg.guild.id).has('SEND_MESSAGES')) {
      await msg.createReply('And so, time flows again.');
      await msg.channel.updateOverwrite(msg.guild.id, {
        SEND_MESSAGES: null,
        ADD_REACTIONS: null
      });
    }
  }
}

module.exports = new Chill();
