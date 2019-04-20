const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');

class ModsOnly extends ArgumentPrecondition {
  constructor() {
    super({ name: 'modsonly' });
  }

  async run(command, msg, argument, args, value) {
    if (value && ModerationService.getPermLevel(msg.dbGuild, msg.member) < 1) {
      return PreconditionResult.fromError(
        command, 'only moderators may create moderator only polls'
      );
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new ModsOnly();
