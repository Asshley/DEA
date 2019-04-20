const { Argument, Command } = require('patron.js');
const {
  MAX_AMOUNTS: { TRIVIA: MAX_TRIVIA }
} = require('../../utility/Constants.js');

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
    const keys = Object.keys(msg.dbGuild.trivia);

    if (keys.length > MAX_TRIVIA) {
      return msg.createErrorReply('this server has the max amount of trivia questions.');
    } else if (keys.some(x => x.toLowerCase() === args.question.toLowerCase())) {
      return msg.createErrorReply('this question already exists.');
    }

    const question = `trivia.${args.question}`;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $set: { [question]: args.answer } });

    return msg.createReply(`you've successfully added question the **${args.question}**.`);
  }
}

module.exports = new AddTriviaQuestion();
