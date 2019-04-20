const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class MaxVaultItems extends ArgumentPrecondition {
  constructor() {
    super({ name: 'maxvaultitems' });
  }

  async run(command, msg, argument, args, value, options) {
    const gang = msg.dbGang;
    const items = Object.keys(gang.vault).filter(x => gang.vault[x] > 0);
    const [itemName] = args.item.names;
    const inVault = Object.prototype.hasOwnProperty.call(gang.vault, itemName);
    const amount = gang.vault[itemName] + value;

    if ((value > options.maxAmount || inVault) && amount > options.maxAmount) {
      return PreconditionResult.fromError(
        command,
        `you may not have more than ${options.maxAmount} of this item in your gang's vault.`
      );
    } else if (items.length >= options.maxUnique && !items.includes(itemName)) {
      return PreconditionResult.fromError(command, `you may not have more than or equal \
to ${options.maxUnique} unique items in your gang's vault.`);
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new MaxVaultItems();
