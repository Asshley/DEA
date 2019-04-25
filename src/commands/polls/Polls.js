const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const MAX_LENGTH = 20;
const MAX_MESSAGES = 5;
const DELAY = 2e3;
const messages = require('../../../data/messages.json');

class Polls extends Command {
  constructor() {
    super({
      names: ['polls'],
      groupName: 'polls',
      description: 'Finds all polls in server.'
    });
  }

  async run(msg) {
    const polls = msg.dbGuild.polls.sort((a, b) => b.index - a.index);
    let message = '';

    if (polls.length <= 0) {
      return msg.createErrorReply(messages.commands.polls.none);
    }

    for (let i = 0; i < polls.length; i++) {
      message += StringUtil.format(
        messages.commands.polls.message, polls[i].index, polls[i].name
      );

      if (i === MAX_LENGTH) {
        await msg.author.DMFields(
          [`Polls For Server: ${msg.channel.guild.name}`, `\`\`\`\n${message}\`\`\``], false
        );

        if (!(i % MAX_MESSAGES)) {
          await Util.delay(DELAY);
        }

        message = '';
      }
    }

    if (!StringUtil.isNullOrWhiteSpace(message)) {
      await msg.author.DMFields(
        [`Polls For Server: ${msg.channel.guild.name}`, `\`\`\`\n${message}\`\`\``], false
      );
    }

    return msg.createReply(messages.commands.polls.success);
  }
}

module.exports = new Polls();
