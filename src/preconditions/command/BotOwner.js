const { Precondition, PreconditionResult } = require('patron.js');
const { BOT_OWNERS } = require('../../utility/Constants.js');

class BotOwner extends Precondition {
  constructor() {
    super({ name: 'botowner' });
  }

  async run(command, msg) {
    if (BOT_OWNERS.includes(msg.author.id)) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      'you must be a bot owner in order to use this command.'
    );
  }
}

module.exports = new BotOwner();
