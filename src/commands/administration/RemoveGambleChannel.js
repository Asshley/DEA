const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.removeGambleChannel.notGambleChannel);
    }

    const update = {
      $pull: {
        'channels.gamble': args.channel.id
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(
      StringUtil.format(messages.commands.removeGambleChannel.sucessful, args.channel.mention)
    );
  }
}

module.exports = new RemoveGambleChannel();
