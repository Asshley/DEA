const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
    const invite = await msg.channel.createInvite({ maxUses: 1 });

    return msg.createReply(StringUtil.format(messages.commands.singleUse, invite.code));
  }
}

module.exports = new SingleUse();
