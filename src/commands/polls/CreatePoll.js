const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: {
    POLLS: { POLL_TITLE, ANSWERS: MAX_ANSWERS, PER_GUILD: MAX_PER_GUILD, ANSWER: MAX_ANSWER }
  },
  MISCELLANEA: { DAYS_TO_MS }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const Poll = require('../../structures/Poll.js');

class CreatePoll extends Command {
  constructor() {
    super({
      names: ['createpoll', 'makepoll'],
      groupName: 'polls',
      description: 'Create a poll.',
      args: [
        new Argument({
          name: 'poll name',
          key: 'name',
          type: 'string',
          example: '"is john gay" ',
          preconditionOptions: [{ length: POLL_TITLE }],
          preconditions: ['maximumlength', 'availablepoll', 'notindex']
        }),
        new Argument({
          name: 'choices',
          key: 'choices',
          type: 'string',
          example: 'yes~no~maybe'
        }),
        new Argument({
          name: 'days to last',
          key: 'days',
          type: 'float',
          example: '4',
          defaultValue: 1,
          preconditionOptions: [{ maximum: 7 }, { minimum: 1 }],
          preconditions: ['maximum', 'minimum']
        }),
        new Argument({
          name: 'elder only',
          key: 'eldersOnly',
          type: 'bool',
          example: 'true',
          defaultValue: false
        }),
        new Argument({
          name: 'mods only',
          key: 'modsOnly',
          type: 'bool',
          example: 'false',
          defaultValue: false,
          remainder: true,
          preconditions: ['modsonly']
        })
      ]
    });
  }

  async run(msg, args) {
    const days = args.days * DAYS_TO_MS;
    const choices = args.choices.split('~');

    if (choices.length > MAX_ANSWERS) {
      return msg.createErrorReply(`you may not have more than \
${MAX_ANSWERS} answers on your poll.`);
    } else if (msg.dbGuild.polls.length > MAX_PER_GUILD) {
      return msg.createErrorReply(`you may not have more than \
${MAX_ANSWERS} polls in the guild at once.`);
    }

    const choicesObj = {};

    for (let i = 0; i < choices.length; i++) {
      if (choices[i + 1] === choices[i]) {
        return msg.createErrorReply('you may not have multiple choices that are identical.');
      } else if (choices[i].length > MAX_ANSWER) {
        return msg.createErrorReply(`you may not have more than \
${MAX_ANSWER} characters in your answer.`);
      }

      choicesObj[choices[i]] = { voters: [] };
    }

    const pollIndex = Poll.getEmptyIndex(msg.dbGuild);
    const poll = new Poll({
      index: pollIndex,
      name: args.name,
      author: msg.author.id,
      choices: choicesObj,
      length: days,
      eldersOnly: args.eldersOnly,
      modsOnly: args.modsOnly,
      createdAt: Date.now()
    });

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, { $push: { polls: poll.data } });

    return msg.createReply(`you've successfully created a poll with the name \
${StringUtil.boldify(args.name)}.`);
  }
}

module.exports = new CreatePoll();
