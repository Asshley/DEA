const { Precondition, PreconditionResult } = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');
const { PERMISSION_LEVELS: { ADMINISTRATOR: ADMIN_LEVEL } } = ModerationService;

class Administrator extends Precondition {
  constructor() {
    super({ name: 'administrator' });
  }

  async run(command, msg) {
    if (ModerationService.getPermLevel(msg.dbGuild, msg.member) >= ADMIN_LEVEL) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      'you must be an administrator in order to use this command.'
    );
  }
}

module.exports = new Administrator();
