const { Command } = require('patron.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const messages = require('../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.takeAll.noItems);
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

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: items.inv
    });
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, { $inc: items.vault });
    await msg.createReply(messages.commands.takeAll.reply);

    const leader = msg.channel.guild.members.get(gang.leaderId);

    return MessageUtil.notify(leader, messages.commands.takeAll.DM, 'takeall');
  }
}

module.exports = new TakeAll();
