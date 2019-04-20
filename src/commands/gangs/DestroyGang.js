const { Command } = require('patron.js');
const {
  MESSAGES: { GANG }
} = require('../../utility/Constants.js');

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
    const gang = msg.dbGang;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $pull: {
        gangs: {
          name: gang.name
        }
      }
    });

    return msg.createReply(GANG.OWNER_DESTROYED_GANG);
  }
}

module.exports = new DestroyGang();
