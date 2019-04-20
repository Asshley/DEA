const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class ResetCooldowns extends Command {
  constructor() {
    super({
      names: ['resetcooldowns', 'deletecooldowns', 'resetcds', 'resetcd'],
      groupName: 'owners',
      description: 'Reset any member\'s cooldowns',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Big Willy#1234',
          defaultValue: ArgumentDefault.Member,
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const commands = msg.client.registry.commands.filter(command => command.hasCooldown);

    for (let i = 0; i < commands.length; i++) {
      commands[i].cooldowns.users[`${args.member.id}-${msg.guild.id}`] = null;
    }

    return msg.createReply(`you have successfully reset all of \
${args.member.id === msg.author.id ? 'your' : `${StringUtil.boldify(args.member.user.tag)}'s`} \
cooldowns.`);
  }
}

module.exports = new ResetCooldowns();
