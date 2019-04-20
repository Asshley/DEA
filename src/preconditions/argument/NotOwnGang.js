const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class NotOwnGang extends ArgumentPrecondition {
  constructor() {
    super({ name: 'notowngang' });
  }

  async run(command, msg, argument, args, value) {
    const gang = msg.dbGang;

    if (value.name !== gang.name) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'you cannot raid your own gang, retard.');
  }
}

module.exports = new NotOwnGang();
