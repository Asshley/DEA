const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const ModerationService = require('../../services/ModerationService.js');
const messages = require('../../../data/messages.json');
const SECONDS = 60;
const MINUTES = 60;
const EXPIRES = SECONDS * MINUTES;

class SingleUse extends Command {
  constructor() {
    super({
      names: ['singleuse', 'oneuse', 'singleinvite'],
      groupName: 'general',
      description: 'Create\'s a one use invite.',
      botPermissions: ['createInstantInvite']
    });
  }

  async run(msg) {
    const invite = await msg.channel.createInvite({
      maxUses: 1, maxAge: EXPIRES
    });

    await ModerationService.tryModLog({
      guild: msg.channel.guild,
      action: 'Single Use Invite',
      reason: `Invite Code: ${invite.code}`,
      color: msg._client.config.colors.invite,
      moderator: msg._client.user,
      user: msg.author
    });

    return msg.createReply(StringUtil.format(messages.commands.singleUse, invite.code));
  }
}

module.exports = new SingleUse();
