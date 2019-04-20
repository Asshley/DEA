const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const {
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT, TO_PERCENT_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class CashPercent extends ArgumentPrecondition {
  constructor() {
    super({ name: 'cashpercent' });
  }

  async run(command, msg, argument, args, value, options) {
    const dbUser = await args.member.dbUser();
    const cashValue = NumberUtil.value(dbUser.cash);
    const rounded = NumberUtil.round(cashValue * options.percent, DECIMAL_ROUND_AMOUNT);

    if (argument.typeReader.inputtedAll) {
      args[`${argument.name}-all`] = rounded;

      return PreconditionResult.fromSuccess();
    } else if (rounded >= value) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, `the maximum percent of ${argument.name} is \
${options.percent * TO_PERCENT_AMOUNT}%, that is ${NumberUtil.toUSD(rounded)}.`);
  }
}

module.exports = new CashPercent();
