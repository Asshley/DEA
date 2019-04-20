const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

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
    const keys = Object.keys(msg.dbGuild.trivia);
    const key = keys.find(x => x.toLowerCase() === args.question.toLowerCase());

    if (!key) {
      return msg.createErrorReply('this trivia question doesn\'t exist.');
    }

    const question = `trivia.${key}`;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $set: {
        [question]: args.answer
      }
    });

    return msg.createReply(`you have successfully modified the answer for the question \
${StringUtil.boldify(key)}.`);
  }
}

module.exports = new ModifyTriviaAnswer();
