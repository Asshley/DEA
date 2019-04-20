const { Postcondition } = require('patron.js');
const { MULTI_MUTEX } = require('../utility/Util.js');
const {
  INVESTMENTS: { CONVOY: { COOLDOWN_REDUCTION: CD_REDUCTION } },
  PREFIX
} = require('../utility/Constants.js');
const handler = require('../singletons/handler.js');

class ReducedCooldown extends Postcondition {
  constructor() {
    super({ name: 'reducedcooldown' });
  }

  run(msg, result) {
    if (msg.dbUser.investments.includes('convoy') && result.success !== false) {
      return MULTI_MUTEX.sync(msg.guild.id, async () => {
        const { command } = await handler.parseCommand(msg, PREFIX.length);

        if (!command.hasCooldown) {
          return;
        }

        const { cooldowns: { users, time } } = command;
        const userCD = users[`${msg.author.id}-${msg.guild.id}`].resets;

        users[`${msg.author.id}-${msg.guild.id}`].resets = userCD - (time * CD_REDUCTION);
      });
    }
  }
}

module.exports = new ReducedCooldown();
