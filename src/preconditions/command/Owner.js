const { Precondition, PreconditionResult } = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');
const { PERMISSION_LEVELS: { OWNER: OWNER_LEVEL } } = ModerationService;

class Owner extends Precondition {
  constructor() {
    super({ name: 'owner' });
  }

  async run(command, msg) {
    if (ModerationService.getPermLevel(msg.dbGuild, msg.member) === OWNER_LEVEL) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      'you must be an owner in order to use this command.'
    );
  }
}

module.exports = new Owner();
