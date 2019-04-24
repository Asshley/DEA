const { Command, Argument } = require('patron.js');
const {
  COLORS: { CHILL: CHILL_COLOR }
} = require('../../utility/Constants.js');
const { Constants: { Permissions } } = require('eris');
const ModerationService = require('../../services/ModerationService.js');
const messages = require('../../data/messages.json');

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
    const guildPerms = msg.channel.guild.roles.get(msg.channel.guild.id).permissions;

    if ((!perms && guildPerms.has('sendMessages')) || perms.has('sendMessages')) {
      return msg.createErrorReply(messages.commands.thaw.alreadyThawed);
    }

    const { deny, allow } = perms;

    await msg.channel.editPermission(
      perms.id, allow & ~Permissions.sendMessages, deny & ~Permissions.sendMessages, perms.type
    );
    await msg.createReply(messages.commands.thaw.success);

    return ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.channel.guild,
      action: 'Thaw',
      color: CHILL_COLOR,
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
}

module.exports = new Thaw();
