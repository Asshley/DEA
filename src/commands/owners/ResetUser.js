const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
    await msg._client.db.userRepo.updateUser(args.member.id, msg.channel.guild.id, {
      $set: {
        cash: 0,
        bounty: 0,
        health: 100,
        inventory: {}
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.resetUser,
      args.member.id === msg.author.id ? 'your' : `${StringUtil
        .boldify(`${args.member.user.username}#${args.member.user.discriminator}`)}'s`
    ));
  }
}

module.exports = new ResetUser();
