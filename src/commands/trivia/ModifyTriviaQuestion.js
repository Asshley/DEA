const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class ModifyTriviaQuestion extends Command {
  constructor() {
    super({
      names: ['modifytriviaquestion', 'modifyquestion', 'modquestion'],
      groupName: 'owners',
      description: 'Modifies a trivia question.',
      preconditions: ['moderator'],
      args: [
        new Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: '"Whose cock is microscopic?"',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength']
        }),
        new Argument({
          name: 'new question',
          key: 'newQuestion',
          type: 'string',
          example: 'Who has the tiniest cock in DEA?',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength', 'triviaquestion'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const keys = Object.keys(msg.dbGuild.trivia.questions);
    const key = keys.find(x => x.toLowerCase() === args.question.toLowerCase());

    if (!key) {
      return msg.createErrorReply(messages.commands.modifyTriviaQuestion.invalid);
    }

    const question = `trivia.questions.${key}`;

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $rename: {
        [question]: `trivia.questions.${args.newQuestion}`
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.modifyTriviaQuestion, key
    ));
  }
}

module.exports = new ModifyTriviaQuestion();
