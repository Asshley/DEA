const { Command, Argument } = require('patron.js');
const { colors } = require('../../../data/config.json');
const {
  Permission,
  Constants: { Permissions }
} = require('eris');
const ModerationService = require('../../services/ModerationService.js');
const messages = require('../../../data/messages.json');

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
    const perms = msg.channel.permissionOverwrites.get(msg.channel.guild.id);

    if (this.getCumulativePermissions(msg.channel).has('sendMessages')) {
      return msg.createErrorReply(messages.commands.thaw.alreadyThawed);
    }

    const { deny, allow } = perms;

    await msg.channel.editPermission(
      perms.id, allow & ~Permissions.sendMessages, deny & ~Permissions.sendMessages, perms.type
    );
    await msg.createReply(messages.commands.thaw.success);

    return ModerationService.tryModLog({
      guild: msg.channel.guild,
      action: 'Thaw',
      color: colors.chill,
      reason: args.reason,
      moderator: msg.author,
      user: null,
      extraInfoType: 'Channel',
      extraInfo: `${msg.channel.name} (${msg.channel.mention})`
    });
  }

  async getOverwrite(channel, id) {
    let overwrite = channel.permissionOverwrites.get(id);

    if (!overwrite) {
      overwrite = await channel.editPermission(id, 0, 0, 'role');
    }

    return overwrite;
  }

  getCumulativePermissions(channel) {
    let everyone = channel.guild.roles.get(channel.guild.id).permissions.allow;

    if ((everyone & Permissions.administrator) > 0) {
      return new Permission(Permissions.all);
    }

    const channelPerms = channel.permissionOverwrites.get(channel.guild.id);

    everyone &= channelPerms ? ~channelPerms.deny : 0;
    everyone |= channelPerms ? channelPerms.allow : 0;

    return new Permission(everyone);
  }
}

module.exports = new Thaw();
