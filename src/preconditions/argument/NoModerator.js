const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');

class NoModerator extends ArgumentPrecondition {
  constructor() {
    super({ name: 'nomoderator' });
  }

  async run(command, msg, argument, args, value) {
    const userPerm = ModerationService.getPermLevel(msg.dbGuild, value);

    if (userPerm === 0) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'you may not use this command on a moderator.');
  }
}

module.exports = new NoModerator();
