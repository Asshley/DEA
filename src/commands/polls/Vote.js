const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { POLLS: { TIME_REQUIRED } } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const ModerationService = require('../../services/ModerationService.js');
const messages = require('../../../data/messages.json');

class Vote extends Command {
  constructor() {
    super({
      names: ['vote'],
      groupName: 'polls',
      description: 'Vote on a poll.',
      args: [
        new Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: '6'
        }),
        new Argument({
          name: 'choice',
          key: 'choice',
          type: 'choice',
          example: '1',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const { days } = NumberUtil.msToTime(TIME_REQUIRED);
    const { dbGuild } = msg;

    if (args.poll.elderOnly && Date.now() - msg.member.joinedAt < TIME_REQUIRED) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.vote.requirement, days
      ));
    } else if (args.poll.modOnly && ModerationService.getPermLevel(dbGuild, msg.member) < 1) {
      return msg.createErrorReply(messages.commands.vote.modOnly);
    } else if (args.poll.choices[args.choice].voters.includes(msg.author.id)) {
      return msg.createErrorReply(messages.commands.vote.sameChoice);
    }

    const keys = Object.keys(args.poll.choices);
    const pollIndex = dbGuild.polls.findIndex(x => x.name === args.poll.name);
    const update = {};
    let voted;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const choice = args.poll.choices[key];

      if (choice.voters.includes(msg.author.id)) {
        voted = `polls.${pollIndex}.choices.${key}.voters`;
        update.$pull = {
          [voted]: msg.author.id
        };
      }
    }

    voted = `polls.${pollIndex}.choices.${args.choice}.voters`;
    update.$push = {
      [voted]: msg.author.id
    };
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.vote.success, args.choice, args.poll.name
    ));
  }
}

module.exports = new Vote();
