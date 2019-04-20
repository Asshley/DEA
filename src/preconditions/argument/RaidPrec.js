const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const {
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT },
  RESTRICTIONS: { COMMANDS: { RAID } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Raid extends ArgumentPrecondition {
  constructor() {
    super({ name: 'raid' });
  }

  async run(command, msg, argument, args, value) {
    const wealth = NumberUtil.round(
      NumberUtil.value(value.wealth) * RAID.MAXIMUM_WEALTH,
      DECIMAL_ROUND_AMOUNT
    );

    if (args.raid <= wealth) {
      return PreconditionResult.fromSuccess();
    }

    const amount = RAID.MAXIMUM_WEALTH * DECIMAL_ROUND_AMOUNT;

    return PreconditionResult.fromError(command, `you are overkilling it. You only need ${NumberUtil
      .toUSD(wealth)} to steal 40% of their cash that is ${NumberUtil
      .toUSD(NumberUtil.round(NumberUtil.value(value.wealth) * amount, DECIMAL_ROUND_AMOUNT))}.`);
  }
}

module.exports = new Raid();
