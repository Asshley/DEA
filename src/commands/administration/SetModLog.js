const { Command, Argument } = require('patron.js');

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

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully set the mod log channel to ${args.channel}.`);
  }
}

module.exports = new SetModLog();
