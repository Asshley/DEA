const { Postcondition } = require('patron.js');
const { PREFIX } = require('../utility/Constants.js');
const { MULTI_MUTEX } = require('../utility/Util.js');
const handler = require('../services/handler.js');

class PerGangRaid extends Postcondition {
  constructor() {
    super({ name: 'pergangraid' });
  }

  async run(msg, result) {
    if (result.success !== false) {
      const { dbGang: gang } = msg;
      const { command: { cooldowns: { users } } } = await handler.parseCommand(msg, PREFIX.length);
      const gangMembers = gang.members
        .concat(gang.leaderId)
        .filter(x => x.id || x !== msg.author.id);

      for (let i = 0; i < gangMembers.length; i++) {
        await MULTI_MUTEX.sync(msg.channel.guild.id, async () => this.updateCooldown({
          msg,
          users,
          member: gangMembers[i].id || gangMembers[i]
        }));
      }
    }
  }

  updateCooldown({ msg, member, users } = {}) {
    users[`${member}-${msg.channel.guild.id}`] = {
      resets: users[`${msg.author.id}-${msg.channel.guild.id}`].resets,
      used: 1
    };
  }
}

module.exports = new PerGangRaid();
