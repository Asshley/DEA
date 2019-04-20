const { Command } = require('patron.js');
const MessageUtil = require('../../utility/MessageUtil.js');

class TakeAll extends Command {
  constructor() {
    super({
      names: ['takeall', 'takeallvault'],
      groupName: 'gangs',
      description: 'Take all your gang\'s item vault.',
      preconditions: ['ingang', 'gangowner']
    });
  }

  async run(msg) {
    const gang = msg.dbGang;
    const keys = Object.keys(gang.vault).filter(x => gang.vault[x] > 0);

    if (!keys.length) {
      return msg.createErrorReply('you don\'t have any items in your gang\'s vault.');
    }

    const items = {
      inv: {},
      vault: {}
    };
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);

    for (let i = 0; i < keys.length; i++) {
      const amount = gang.vault[keys[i]];

      items.inv[`inventory.${keys[i]}`] = amount;
      items.vault[`gangs.${gangIndex}.vault.${keys[i]}`] = -amount;
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: items.inv });
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $inc: items.vault });
    await msg.createReply('you have successfully taken all of your gangs items from the vault.');

    const leader = msg.guild.members.get(gang.leaderId);

    return MessageUtil.notify(leader, 'You\'ve taken all of your gang\'s items.', 'takeall');
  }
}

module.exports = new TakeAll();
