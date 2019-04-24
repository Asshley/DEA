const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class ModifyTriviaAnswer extends Command {
  constructor() {
    super({
      names: ['modifytriviaanswer', 'modifyanswer', 'modanswer'],
      groupName: 'owners',
      description: 'Modifies the answer to a trivia question.',
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
          name: 'answer',
          key: 'answer',
          type: 'string',
          example: 'John#7015',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const keys = Object.keys(msg.dbGuild.trivia.questions);
    const key = keys.find(x => x.toLowerCase() === args.question.toLowerCase());

    if (!key) {
      return msg.createErrorReply(messages.commands.modifyTriviaAnswer.invalid);
    }

    const question = `trivia.questions.${key}`;

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $set: {
        [question]: args.answer
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.modifyTriviaAnswer.success, key, args.answer
    ));
  }
}

module.exports = new ModifyTriviaAnswer();
