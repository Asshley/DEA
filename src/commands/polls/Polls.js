const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const PromiseUtil = require('../../utility/PromiseUtil.js');
const MAX_LENGTH = 20;
const MAX_MESSAGES = 5;
const DELAY = 2e3;

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
      return msg.createErrorReply('there\'s currently no active polls in this server.');
    }

    for (let i = 0; i < polls.length; i++) {
      message += `${polls[i].index}. ${polls[i].name}\n`;

      if (i === MAX_LENGTH) {
        await msg.author.DMFields(
          [`Polls For Server: ${msg.guild.name}`, `\`\`\`\n${message}\`\`\``], false
        );

        if (!(i % MAX_MESSAGES)) {
          await PromiseUtil.delay(DELAY);
        }

        message = '';
      }
    }

    if (!StringUtil.isNullOrWhiteSpace(message)) {
      await msg.author.DMFields(
        [`Polls For Server: ${msg.guild.name}`, `\`\`\`\n${message}\`\`\``], false
      );
    }

    return msg.createReply(`you have been DMed with all ${msg.guild.name} polls.`);
  }
}

module.exports = new Polls();
