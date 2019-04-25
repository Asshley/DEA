const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class DeleteGang extends Command {
  constructor() {
    super({
      names: ['deletegang'],
      groupName: 'owners',
      description: 'Delete\'s specified gang within your server.',
      args: [
        new Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'best gang ever',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $pull: {
        gangs: {
          name: args.gang.name
        }
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.deleteGang, args.gang.name
    ));
  }
}

module.exports = new DeleteGang();
