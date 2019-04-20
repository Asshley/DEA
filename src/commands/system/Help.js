const { Command, Argument, Context } = require('patron.js');
const { MESSAGES: { HELP: HELP_MESSAGE }, PREFIX } = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');

class Help extends Command {
  constructor() {
    super({
      names: [
        'help',
        'commands',
        'command',
        'cmd',
        'cmds',
        'support',
        'docs'
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
      await msg.author.DM(StringUtil.format(HELP_MESSAGE, msg.client.user.username));

      if (msg.channel.type !== 'dm') {
        return msg.createReply('you have been DMed with all the command information!');
      }
    } else {
      const input = args
        .command.startsWith(PREFIX) ? args.command.slice(PREFIX.length) : args.command;
      const lowerInput = input.toLowerCase();
      const command = msg.client.registry.commands.find(x => x.names.includes(lowerInput));

      if (!command) {
        return msg.createErrorReply('this command does not exist.');
      }

      const format = `**Description:** ${command.description}
**Usage:** \`${PREFIX}${command.getUsage()}\`\n**Example:** \`${PREFIX}${command.getExample()}\``;

      return msg.channel.createMessage(format, {
        title: StringUtil.upperFirstChar(command.names[0])
      });
    }
  }
}

module.exports = new Help();
