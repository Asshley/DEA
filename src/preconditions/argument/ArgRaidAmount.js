const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class ArgRaidAmount extends ArgumentPrecondition {
  constructor() {
    super({ name: 'argraidamount' });
  }

  async run(command, msg, argument, args, value) {
    if (NumberUtil.value(value.wealth) >= args.raid) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'their gang doesn\'t have enough money.');
  }
}

module.exports = new ArgRaidAmount();
