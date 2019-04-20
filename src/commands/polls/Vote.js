const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { POLLS: { TIME_REQUIRED } } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const ModerationService = require('../../services/ModerationService.js');

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
    const { days } = NumberUtil.msToTime(TIME_REQUIRED).days;
    const { dbGuild } = msg;

    if (args.poll.elderOnly && Date.now() - msg.member.joinedAt < TIME_REQUIRED) {
      return msg.createErrorReply(`you may not vote on this poll until you've been \
in this server for ${days} days.`);
    } else if (args.poll.modOnly && ModerationService.getPermLevel(dbGuild, msg.member) < 1) {
      return msg.createErrorReply('you may only vote on this poll if you\'re a moderator.');
    } else if (args.poll.choices[args.choice].voters.includes(msg.author.id)) {
      return msg.createErrorReply('you may not vote on the same choice twice.');
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
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you've successfully voted \`${args.choice}\` on poll: \
${StringUtil.boldify(args.poll.name)}.`);
  }
}

module.exports = new Vote();
