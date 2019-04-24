const { Argument, Command } = require('patron.js');
const {
  MAX_AMOUNTS: { TRIVIA: MAX_TRIVIA }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class AddTriviaQuestion extends Command {
  constructor() {
    super({
      names: ['addtriviaquestion', 'addtrivia', 'addquestion'],
      groupName: 'trivia',
      description: 'Create a trivia question.',
      preconditions: ['administrator'],
      args: [
        new Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: '"is john gay"',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength', 'triviaquestion']
        }),
        new Argument({
          name: 'answer',
          key: 'answer',
          type: 'string',
          example: 'yes he is',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const keys = Object.keys(msg.dbGuild.trivia.questions);

    if (keys.length > MAX_TRIVIA) {
      return msg.createErrorReply(messages.commands.addTriviaQuestion.maxQuestions);
    } else if (keys.some(x => x.toLowerCase() === args.question.toLowerCase())) {
      return msg.createErrorReply(messages.commands.addTriviaQuestion.exists);
    }

    const question = `trivia.questions.${args.question}`;

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $set: {
        [question]: args.answer
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.addTriviaQuestion.success, args.question
    ));
  }
}

module.exports = new AddTriviaQuestion();
