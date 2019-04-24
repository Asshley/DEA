const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
    const exists = Object.keys(msg.dbGuild.trivia.questions)
      .find(x => x.toLowerCase() === args.question.toLowerCase());

    if (!exists) {
      return msg.createErrorReply(messages.commands.removeTriviaQuestion.invalid);
    }

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $unset: {
        [`trivia.questions.${exists}`]: ''
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.removeTriviaQuestion.success, exists
    ));
  }
}

module.exports = new RemoveTriviaQuestion();
