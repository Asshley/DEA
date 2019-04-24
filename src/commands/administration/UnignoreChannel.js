const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class UnignoreChannel extends Command {
  constructor() {
    super({
      names: ['unignorechannel', 'removechannel', 'removeignoredchannel', 'removechan'],
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
      return msg.createErrorReply(messages.commands.unignoreChannel.notIgnored);
    }

    const update = {
      $pull: {
        'channels.ignore': args.channel.id
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(
      StringUtil.format(messages.commands.unignoreChannel.successful, args.channel.mention)
    );
  }
}

module.exports = new UnignoreChannel();
