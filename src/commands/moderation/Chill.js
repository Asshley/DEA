const { Command, Argument } = require('patron.js');
const {
  DEFAULTS: { CHILL: DEFAULT_CHILL },
  RESTRICTIONS: { COMMANDS: { CHILL } },
  COLORS: { CHILL: CHILL_COLOR }
} = require('../../utility/Constants.js');
const { Constants: { Permissions } } = require('eris');
const ModerationService = require('../../services/ModerationService.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');
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
    const perms = await this.getOverwrite(msg.channel, msg.channel.guild.id);
    const { deny, allow } = perms;

    if (this.hasSendPermission(deny) && !this.hasSendPermission(allow)) {
      return msg.createErrorReply(messages.commands.chill.alreadyChilled);
    }

    const time = args.time.toLocaleString();

    await ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.channel.guild,
      action: 'Chill',
      color: CHILL_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: null,
      extraInfoType: 'Duration',
      extraInfo: `${time} seconds\n**Channel:** ${msg.channel.name} (${msg.channel.mention})`
    });
    await msg.channel.editPermission(
      perms.id, allow & ~Permissions.sendMessages, deny | Permissions.sendMessages, perms.type
    );
    await msg.createReply(StringUtil.format(messages.commands.chill.chilled, time));
    await Util.delay(args.time * TO_SECONDS);

    if (!msg.channel.permissionOverwrites.get(msg.channel.guild.id).has('sendMessages')) {
      await msg.createReply(messages.commands.chill.thawed);
      await msg.channel.editPermission(
        perms.id, allow & ~Permissions.sendMessages, deny & ~Permissions.sendMessages, perms.type
      );
    }
  }

  async getOverwrite(channel, id) {
    let overwrite = channel.permissionOverwrites.get(id);

    if (!overwrite) {
      overwrite = await channel.editPermission(id, 0, 0, 'role');
    }

    return overwrite;
  }

  hasSendPermission(bitfield) {
    if ((bitfield & Permissions.administrator) > 0) {
      return true;
    }

    return (bitfield & Permissions.sendMessages) === Permissions.sendMessages;
  }
}

module.exports = new Chill();
