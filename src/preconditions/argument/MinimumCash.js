const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class MinimumCash extends ArgumentPrecondition {
  constructor() {
    super({ name: 'minimumcash' });
  }

  async run(command, msg, argument, args, value, options) {
    let val = value;

    if (command.names[0] === 'rob' && argument.typeReader.inputtedAll) {
      val = args[`${argument.name}-all`];
    }

    if (val === 'null' || val >= options.minimum) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      `the minimum ${argument.name} is ${NumberUtil.toUSD(options.minimum)}.`
    );
  }
}

module.exports = new MinimumCash();
