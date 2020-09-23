const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
          example: '"Big Willy#1234"',
          defaultValue: ArgumentDefault.Member,
          infinite: true,
        })
      ]
    });
  }

  async run(msg, args) {
    const commands = msg._client.registry.commands.filter(command => command.hasCooldown);

    for (let k = 0; k < args.member.length; k++) {
      const mem = args.member[k];

      for (let i = 0; i < commands.length; i++) {
        commands[i].cooldowns.users[`${mem.id}-${msg.channel.guild.id}`] = null;
      }
    }

    if (args.member.length === 1) {
      return msg.createReply(StringUtil.format(
        messages.commands.resetCooldowns.one,
        args.member.id === msg.author.id ? 'your' : `${StringUtil
          .boldify(`${args.member[0].user.username}#${args.member[0].user.discriminator}`)}'s`
      ));
    }

    return msg.createReply(messages.commands.resetCooldowns.multiple);

  }
}

module.exports = new ResetCooldowns();
