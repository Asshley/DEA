const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class VaultHasAmount extends ArgumentPrecondition {
  constructor() {
    super({ name: 'vaulthasamount' });
  }

  async run(command, msg, argument, args, value) {
    const gang = msg.dbGang;

    if (gang.vault[args.item.names[0]] < value) {
      return PreconditionResult.fromError(command, `your gang doesn't have ${value} of this item.`);
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new VaultHasAmount();
