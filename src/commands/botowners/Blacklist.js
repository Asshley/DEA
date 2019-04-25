const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');
const config = require('../../../data/config.json');

class Blacklist extends Command {
  constructor() {
    super({
      names: ['blacklist'],
      groupName: 'botowners',
      description: 'Blacklists a user.',
      args: [
        new Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'Jesus Christ#4444',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (config.botOwners.includes(args.user.id)) {
      return msg.createErrorReply(messages.commands.blacklist.failed);
    }

    await msg._client.db.blacklistRepo.insertBlacklist(args.user.id);

    return msg.createReply(StringUtil.format(
      messages.commands.blacklist.success, `${args.user.username}#${args.user.discriminator}`
    ));
  }
}

module.exports = new Blacklist();
