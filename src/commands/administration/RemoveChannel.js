const { Command, Argument } = require('patron.js');

class RemoveChannel extends Command {
  constructor() {
    super({
      names: ['removechannel', 'removeignoredchannel', 'removechan'],
      groupName: 'administration',
      description: 'Removes a channel where the bot will not reward cash per message.',
      args: [
        new Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'cool-kids',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const { channels } = msg.dbGuild;

    if (!channels.ignore.includes(args.channel.id)) {
      return msg.createErrorReply('this channel isn\'t an ignored channel.');
    }

    const update = {
      $pull: {
        'channels.ignore': args.channel.id
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully removed ${args.channel} as an ignored channel.`);
  }
}

module.exports = new RemoveChannel();
