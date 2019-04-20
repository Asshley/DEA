const { Command, Argument, ArgumentDefault } = require('patron.js');

class ResetUser extends Command {
  constructor() {
    super({
      names: ['resetuser'],
      groupName: 'owners',
      description: 'Reset any member\'s data.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: ArgumentDefault.Member,
          example: 'Jesus Christ#4444',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.userRepo.deleteUser(args.member.id, msg.guild.id);

    return msg.createReply(`you have successfully reset all of \
${args.member.id === msg.author.id ? 'your' : `${args.member.user.tag}'s`} data.`);
  }
}

module.exports = new ResetUser();
