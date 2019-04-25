const { Command } = require('patron.js');
const messages = require('../../../data/messages.json');

class DestroyGang extends Command {
  constructor() {
    super({
      names: ['destroygang', 'desgang'],
      groupName: 'gangs',
      description: 'Destroy your gang.',
      preconditions: ['ingang', 'gangowner']
    });
  }

  async run(msg) {
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $pull: {
        gangs: {
          name: msg.dbGang.name
        }
      }
    });

    return msg.createReply(messages.commands.destroyGang);
  }
}

module.exports = new DestroyGang();
