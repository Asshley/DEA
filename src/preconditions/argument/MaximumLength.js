const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class MaximumLength extends ArgumentPrecondition {
  constructor() {
    super({ name: 'maximumlength' });
  }

  async run(command, msg, argument, args, value, options) {
    if (value.length <= options.length) {
      return PreconditionResult.fromSuccess();
    }

    const s = value.length > 1 ? 's' : '';

    return PreconditionResult.fromError(
      command,
      `the ${argument.name} may not be longer than ${options.length} character${s}.`
    );
  }
}

module.exports = new MaximumLength();
