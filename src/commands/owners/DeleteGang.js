const { Command, Argument } = require('patron.js');

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
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $pull: {
        gangs: {
          name: args.gang.name
        }
      }
    });

    return msg.createReply(`successfully deleted gang ${args.gang.name}.`);
  }
}

module.exports = new DeleteGang();
