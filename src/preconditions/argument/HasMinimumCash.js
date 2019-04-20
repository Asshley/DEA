const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class HasMinimumCash extends ArgumentPrecondition {
  constructor() {
    super({ name: 'hasminimumcash' });
  }

  async run(command, msg, argument, args, value, options) {
    const cash = NumberUtil.value(msg.dbUser.cash);

    if (cash >= options.minimum) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, `you need ${NumberUtil.toUSD(options.minimum)} \
to use this command. Balance: ${NumberUtil.toUSD(cash)}.`);
  }
}

module.exports = new HasMinimumCash();
