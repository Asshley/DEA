const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class RemovePoll extends Command {
  constructor() {
    super({
      names: ['removepoll'],
      groupName: 'polls',
      description: 'Destroy your poll.',
      args: [
        new Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: '4',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.author.id !== args.poll.author) {
      return msg.createErrorReply('you\'re not the creator of this poll.');
    }

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $pull: { polls: args.poll } });

    return msg.createReply(`successfully destroyed your poll \
${StringUtil.boldify(args.poll.name)}.`);
  }
}

module.exports = new RemovePoll();
