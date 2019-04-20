const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

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
    const dbUser = await args.member.dbUser();

    return msg.channel.createMessage(
      `${StringUtil.boldify(args.member.user.tag)}'s health: ${dbUser.health}.`
    );
  }
}

module.exports = new Health();
