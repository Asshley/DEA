const { Command, Argument } = require('patron.js');

class RemoveGambleChannel extends Command {
  constructor() {
    super({
      names: [
        'removegamblingchannel',
        'removegamble',
        'removegambling',
        'deletegamble',
        'deletegambling'
      ],
      groupName: 'administration',
      description: 'Sets the gambling channel.',
      args: [
        new Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'something',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const { channels } = msg.dbGuild;

    if (!channels.gamble.includes(args.channel.id)) {
      return msg.createErrorReply('this channel isn\'t a gambling channel.');
    }

    const update = {
      $pull: {
        'channels.gamble': args.channel.id
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully removed ${args.channel} as a gambling channel.`);
  }
}

module.exports = new RemoveGambleChannel();
