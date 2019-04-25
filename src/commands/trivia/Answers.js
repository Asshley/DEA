const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const MAX_LENGTH = 1024;
const MAX_MESSAGES = 5;
const DELAY = 2e3;
const messages = require('../../../data/messages.json');

class Answers extends Command {
  constructor() {
    super({
      names: ['answers'],
      groupName: 'trivia',
      description: 'See what the trivia answers are.',
      preconditions: ['moderator']
    });
  }

  async run(msg) {
    const keys = Object.keys(msg.dbGuild.trivia.questions);

    if (!keys.length) {
      return msg.createErrorReply(messages.commands.answers.none);
    }

    let description = '';

    for (let i = 0; i < keys.length; i++) {
      const question = keys[i];
      const answer = msg.dbGuild.trivia.questions[keys[i]];

      description += StringUtil.format(
        messages.commands.answers.message, i + 1, StringUtil.boldify(question), answer
      );

      if (description.length > MAX_LENGTH) {
        const dm = await msg.author.tryDM(description, { title: 'Trivia Answers' });

        if (!dm) {
          return msg.createErrorReply(messages.commands.answers.cantDM);
        } else if (!(i % MAX_MESSAGES)) {
          await Util.delay(DELAY);
        }

        description = '';
      }
    }

    if (!StringUtil.isNullOrWhiteSpace(description)) {
      await msg.author.tryDM(description, { title: 'Trivia Answers' });
    }

    return msg.createReply(messages.commands.answers.success);
  }
}

module.exports = new Answers();
