const { Command, Context } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');
const config = require('../../../data/config.json');

class Invite extends Command {
  constructor() {
    super({
      names: ['invite', 'join', 'add'],
      groupName: 'system',
      description: 'Add Bot to your server.',
      usableContexts: [Context.DM, Context.Guild]
    });
  }

  run(msg) {
    return msg.createReply(StringUtil.format(
      messages.commands.invite, config.botLink, msg._client.user.username, config.serverLink
    ));
  }
}

module.exports = new Invite();
