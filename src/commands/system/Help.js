const { Command, Argument, Context } = require('patron.js');
const { CHANNEL_TYPES } = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');
const config = require('../../../data/config.json');

class Help extends Command {
  constructor() {
    super({
      names: [
        'help',
        'commands',
        'command',
        'cmd',
        'cmds',
        'support'
      ],
      groupName: 'system',
      description: 'All command information.',
      usableContexts: [Context.DM, Context.Guild],
      args: [
        new Argument({
          name: 'command',
          key: 'command',
          type: 'string',
          defaultValue: '',
          example: 'money'
        })
      ]
    });
  }

  async run(msg, args) {
    if (StringUtil.isNullOrWhiteSpace(args.command)) {
      await msg.author.DM(StringUtil.format(
        messages.commands.help.message,
        msg._client.user.username,
        config.botLink,
        config.prefix,
        config.prefix,
        msg._client.user.username,
        config.serverLink
      ));

      if (msg.channel.type !== CHANNEL_TYPES.DM) {
        return msg.createReply(messages.commands.help.dm);
      }
    } else {
      const input = args.command.startsWith(config.prefix) ? args
        .command.slice(config.prefix.length) : args.command;
      const lowerInput = input.toLowerCase();
      const command = msg._client.registry.commands.find(x => x.names.includes(lowerInput));

      if (!command) {
        return msg.createErrorReply(messages.commands.help.invalidCommand);
      }

      return msg.channel.sendMessage(StringUtil.format(
        messages.commands.help.usage,
        command.description,
        config.prefix,
        command.getUsage(),
        config.prefix,
        command.getExample()
      ), { title: StringUtil.upperFirstChar(command.names[0]) });
    }
  }
}

module.exports = new Help();
