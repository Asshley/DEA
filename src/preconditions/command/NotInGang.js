const { Precondition, PreconditionResult } = require('patron.js');

class NotInGang extends Precondition {
  constructor() {
    super({ name: 'notingang' });
  }

  async run(command, msg) {
    const { dbGang: gang } = msg;

    if (!gang) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'you\'re already in a gang.');
  }
}

module.exports = new NotInGang();
