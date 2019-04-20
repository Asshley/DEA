const { Command, Argument } = require('patron.js');

class RemoveTriviaQuestion extends Command {
  constructor() {
    super({
      names: ['removetriviaquestion', 'removetrivia', 'removequestion'],
      groupName: 'trivia',
      description: 'Remove a trivia question.',
      preconditions: ['administrator'],
      args: [
        new Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: '"is john gay"',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const exists = Object.keys(msg.dbGuild.trivia)
      .find(x => x.toLowerCase() === args.question.toLowerCase());

    if (!exists) {
      return msg.createErrorReply('this trivia question doesn\'t exist.');
    }

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $unset: {
        [`trivia.${exists}`]: ''
      }
    });

    return msg.createReply(`you've successfully removed the question **${args.question}**.`);
  }
}

module.exports = new RemoveTriviaQuestion();
