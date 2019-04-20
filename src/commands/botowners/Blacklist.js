const { Command, Argument } = require('patron.js');

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
    const isBlacklisted = await msg.client.db.blacklistRepo.anyBlacklist(args.user.id);

    if (isBlacklisted) {
      return msg.createErrorReply('this user is already blacklisted.');
    }

    await msg.client.db.blacklistRepo.insertBlacklist(args.user.id);

    return msg.createReply(`you have successfully blacklisted ${args.user.tag}.`);
  }
}

module.exports = new Blacklist();
