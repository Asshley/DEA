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
          example: 'Big Willy#1234',
          defaultValue: ArgumentDefault.Member,
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const commands = msg._client.registry.commands.filter(command => command.hasCooldown);

    for (let i = 0; i < commands.length; i++) {
      commands[i].cooldowns.users[`${args.member.id}-${msg.channel.guild.id}`] = null;
    }

    return msg.createReply(StringUtil.format(
      messages.commands.resetCooldowns,
      args.member.id === msg.author.id ? 'your' : `${StringUtil
        .boldify(`${args.member.user.username}#${args.member.user.discriminator}`)}'s`
    ));
  }
}

module.exports = new ResetCooldowns();
