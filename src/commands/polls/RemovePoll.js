const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.removePoll.notOwner);
    }

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $pull: { polls: args.poll }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.removePoll.success, args.poll.name
    ));
  }
}

module.exports = new RemovePoll();
