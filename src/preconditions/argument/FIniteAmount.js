const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class FiniteAmount extends ArgumentPrecondition {
  constructor() {
    super({ name: 'finiteamount' });
  }

  async run(command, msg, argument, args, value) {
    if (value === 'null' || Number.isFinite(value)) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command, `you can only use finite numbers for the ${argument.name}.`
    );
  }
}

module.exports = new FiniteAmount();
