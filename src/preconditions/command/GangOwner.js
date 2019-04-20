const { Precondition, PreconditionResult } = require('patron.js');

class GangOwner extends Precondition {
  constructor() {
    super({ name: 'gangowner' });
  }

  async run(command, msg) {
    const gang = msg.dbGang;

    if (gang.leaderId !== msg.member.id) {
      return PreconditionResult.fromError(
        command,
        'you must be the owner of the gang in order to use this command.'
      );
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new GangOwner();
