const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: {
    POLLS: { POLL_TITLE, ANSWERS: MAX_ANSWERS, PER_GUILD: MAX_PER_GUILD, ANSWER: MAX_ANSWER }
  },
  MISCELLANEA: { DAYS_TO_MS }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');
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
      return msg.createErrorReply(StringUtil.format(
        messages.commands.createPoll.maxAnswers, MAX_ANSWERS
      ));
    } else if (msg.dbGuild.polls.length > MAX_PER_GUILD) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.createPoll.maxPolls, MAX_PER_GUILD
      ));
    }

    const choicesObj = {};

    for (let i = 0; i < choices.length; i++) {
      if (choices[i + 1] === choices[i]) {
        return msg.createErrorReply(messages.commands.createPoll.identicalAnswer);
      } else if (choices[i].length > MAX_ANSWER) {
        return msg.createErrorReply(StringUtil.format(
          messages.commands.createPoll.maxChars, MAX_ANSWER
        ));
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

    await msg._client.db.guildRepo.upsertGuild(msg.channel.guild.id, {
      $push: {
        polls: poll.data
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.createPoll.success, args.name
    ));
  }
}

module.exports = new CreatePoll();
