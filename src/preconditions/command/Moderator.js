const { Precondition, PreconditionResult } = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');
const { PERMISSION_LEVELS: { MODERATOR: MOD_LEVEL } } = ModerationService;

class Moderator extends Precondition {
  constructor() {
    super({ name: 'moderator' });
  }

  async run(command, msg) {
    if (ModerationService.getPermLevel(msg.dbGuild, msg.member) >= MOD_LEVEL) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      'you must be a moderator in order to use this command.'
    );
  }
}

module.exports = new Moderator();
