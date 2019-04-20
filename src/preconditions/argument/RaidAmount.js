const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class RaidAmount extends ArgumentPrecondition {
  constructor() {
    super({ name: 'raidamount' });
  }

  async run(command, msg, argument, args, value) {
    const gang = msg.dbGang;

    if (NumberUtil.value(gang.wealth) >= value) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'your gang doesn\'t have enough money.');
  }
}

module.exports = new RaidAmount();
