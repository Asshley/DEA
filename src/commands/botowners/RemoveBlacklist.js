const { Command, Argument, Context } = require('patron.js');

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
    const isBlacklisted = await msg.client.db.blacklistRepo.anyBlacklist(args.user.id);

    if (!isBlacklisted) {
      return msg.createErrorReply('this user isn\'t blacklisted.');
    }

    await msg.client.db.blacklistRepo.deleteBlacklist(args.user.id);

    return msg.createReply(`successfully removed ${args.user.tag}'s blacklist.`);
  }
}

module.exports = new RemoveBlacklist();
