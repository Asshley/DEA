const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class SetModLog extends Command {
  constructor() {
    super({
      names: [
        'setmodlog',
        'setmodlog',
        'setmodlogs',
        'setlog',
        'setlogs'
      ],
      groupName: 'administration',
      description: 'Sets the mod log channel.',
      args: [
        new Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Mod Log',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const update = {
      $set: {
        'channels.modLog': args.channel.id
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(
      StringUtil.format(messages.commands.setModLog, args.channel.mention)
    );
  }
}

module.exports = new SetModLog();
