const { Command, Argument } = require('patron.js');

class AddGambleChannel extends Command {
  constructor() {
    super({
      names: ['addgamblingchannel', 'gamblechannel', 'addgamble', 'gamblingchannel'],
      groupName: 'administration',
      description: 'Adds a gambling channel.',
      args: [
        new Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'gambling',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gambling = msg.dbGuild.channels.gamble;

    if (gambling.includes(args.channel.id)) {
      return msg.createErrorReply('this channel is already a gambling channel.');
    }

    const update = {
      $push: {
        'channels.gamble': args.channel.id
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully added ${args.channel} as a gambling channel.`);
  }
}

module.exports = new AddGambleChannel();
