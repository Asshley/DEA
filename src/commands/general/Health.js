const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Health extends Command {
  constructor() {
    super({
      names: ['health', 'life', 'heart'],
      groupName: 'general',
      description: 'View the health of anyone.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: ArgumentDefault.Member,
          example: 'Nibba You Cray#3333',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const isSelf = args.member.id === msg.author.id;
    const dbUser = isSelf ? msg.dbUser : await args.member.dbUser();

    return msg.channel.sendMessage(StringUtil.format(
      messages.commands.health,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`),
      dbUser.health
    ));
  }
}

module.exports = new Health();
