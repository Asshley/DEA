const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.addGambleChannel.existing);
    }

    const update = {
      $push: {
        'channels.gamble': args.channel.id
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(
      StringUtil.format(messages.commands.addGambleChannel.successful, args.channel.mention)
    );
  }
}

module.exports = new AddGambleChannel();
