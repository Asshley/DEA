const { Command, Context } = require('patron.js');
const {
  MESSAGES: { INVITE: INVITE_MESSAGE }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');

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
    return msg.createReply(StringUtil.format(INVITE_MESSAGE, msg.client.user.username));
  }
}

module.exports = new Invite();
