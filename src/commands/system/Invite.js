const { Command, Context } = require('patron.js');
const {
  BOT_LINK, SERVER_LINK
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
      messages.commands.invite, BOT_LINK, msg._client.user.username, SERVER_LINK
    ));
  }
}

module.exports = new Invite();
