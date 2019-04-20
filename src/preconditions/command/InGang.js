const { Precondition, PreconditionResult } = require('patron.js');

class InGang extends Precondition {
  constructor() {
    super({ name: 'ingang' });
  }

  async run(command, msg) {
    const { dbGang: gang } = msg;

    if (gang) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'you aren\'t in a gang.');
  }
}

module.exports = new InGang();
