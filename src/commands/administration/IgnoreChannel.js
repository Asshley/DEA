const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.ignoreChannel.existing);
    }

    const update = {
      $push: {
        'channels.ignore': args.channel.id
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(
      StringUtil.format(messages.commands.ignoreChannel.successful, args.channel.mention)
    );
  }
}

module.exports = new IgnoreChannel();
