const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const MAX_LENGTH = 1024;
const MAX_MESSAGES = 5;
const DELAY = 2e3;
const messages = require('../../data/messages.json');

class Questions extends Command {
  constructor() {
    super({
      names: ['questions', 'trivias'],
      groupName: 'trivia',
      description: 'See what the trivia questions are.'
    });
  }

  async run(msg) {
    const keys = Object.keys(msg.dbGuild.trivia.questions);

    if (!keys.length) {
      return msg.createErrorReply(messages.commands.questions.none);
    }

    let description = '';

    for (let i = 0; i < keys.length; i++) {
      description += StringUtil.format(
        messages.commands.questions.message, i + 1, keys[i]
      );

      if (description.length > MAX_LENGTH) {
        const dm = await msg.author.tryDM(description, { title: 'Trivia Questions' });

        if (!dm) {
          return msg.createErrorReply(messages.commands.questions.cantDM);
        } else if (!(i % MAX_MESSAGES)) {
          await Util.delay(DELAY);
        }

        description = '';
      }
    }

    if (!StringUtil.isNullOrWhiteSpace(description)) {
      await msg.author.tryDM(description, { title: 'Trivia Questions' });
    }

    return msg.createReply(messages.commands.questions.success);
  }
}

module.exports = new Questions();
