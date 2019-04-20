const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class NotInVault extends ArgumentPrecondition {
  constructor() {
    super({ name: 'notinvault' });
  }

  async run(command, msg, argument, args, value) {
    const gang = msg.dbGang;

    if (!gang.vault[value.names[0]] || gang.vault[value.names[0]] <= 0) {
      return PreconditionResult.fromError(command, 'your gang doesn\'t have any of this item.');
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new NotInVault();
