const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const PromiseUtil = require('../../utility/PromiseUtil.js');
const MAX_LENGTH = 1024;
const MAX_MESSAGES = 5;
const DELAY = 2e3;

class Questions extends Command {
  constructor() {
    super({
      names: ['questions', 'trivias'],
      groupName: 'trivia',
      description: 'See what the trivia questions are.'
    });
  }

  async run(msg) {
    const keys = Object.keys(msg.dbGuild.trivia);

    if (!keys.length) {
      return msg.createErrorReply('there are no trivia questions in this server.');
    }

    let description = '';

    for (let i = 0; i < keys.length; i++) {
      description += `${i + 1}. ${StringUtil.boldify(keys[i])}\n`;

      if (description.length > MAX_LENGTH) {
        const dm = await msg.author.tryDM(description, { title: 'Trivia Questions' });

        if (!dm) {
          return msg.createErrorReply('I am unable to DM you.');
        } else if (!(i % MAX_MESSAGES)) {
          await PromiseUtil.delay(DELAY);
        }

        description = '';
      }
    }

    if (!StringUtil.isNullOrWhiteSpace(description)) {
      await msg.author.tryDM(description, { title: 'Trivia Questions' });
    }

    return msg.createReply('you\'ve been DM\'d with all trivia questions.');
  }
}

module.exports = new Questions();
