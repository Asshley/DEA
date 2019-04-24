const { Command, Argument, Context } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class RemoveBlacklist extends Command {
  constructor() {
    super({
      names: ['unblacklist', 'removeblacklist'],
      groupName: 'botowners',
      description: 'Remove\'s blacklist on a user.',
      usableContexts: [Context.DM, Context.Guild],
      args: [
        new Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'The Devil#6666',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg._client.db.blacklistRepo.deleteBlacklist(args.user.id);

    return msg.createReply(StringUtil.format(
      messages.commands.removeBlacklist,
      `${args.user.username}#${args.user.discriminator}`
    ));
  }
}

module.exports = new RemoveBlacklist();
