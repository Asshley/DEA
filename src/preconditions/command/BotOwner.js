const { Precondition, PreconditionResult } = require('patron.js');
const config = require('../../../data/config.json');

class BotOwner extends Precondition {
  constructor() {
    super({ name: 'botowner' });
  }

  async run(command, msg) {
    if (config.botOwners.includes(msg.author.id)) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      'you must be a bot owner in order to use this command.'
    );
  }
}

module.exports = new BotOwner();
