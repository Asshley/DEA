const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Notifications extends Command {
  constructor() {
    super({
      names: ['notifications', 'notifications', 'dms', 'dm'],
      groupName: 'general',
      description: 'View your disabled DMs.'
    });
  }

  async run(msg) {
    const disabled = msg.dbUser.notifications;

    if (!disabled.length) {
      return msg.createErrorReply(messages.commands.notifications.none);
    }

    const listed = StringUtil.list(disabled, 'and', x => `\`${x}\``);

    return msg.createReply(StringUtil.format(messages.commands.notifications.format, listed));
  }
}

module.exports = new Notifications();
