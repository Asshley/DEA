const { Command, Argument } = require('patron.js');

class IgnoreChannel extends Command {
  constructor() {
    super({
      names: ['ignorechannel', 'ignorechan'],
      groupName: 'administration',
      description: 'Adds a channel where the bot will not reward cash per message.',
      args: [
        new Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'spam',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const { channels } = msg.dbGuild;

    if (channels.ignore.includes(args.channel.id)) {
      return msg.createErrorReply('this channel is already an ignored channel.');
    }

    const update = {
      $push: {
        'channels.ignore': args.channel.id
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully added ${args.channel} as an ignored channel.`);
  }
}

module.exports = new IgnoreChannel();
