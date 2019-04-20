const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class MinimumLength extends ArgumentPrecondition {
  constructor() {
    super({ name: 'minimumlength' });
  }

  async run(command, msg, argument, args, value, options) {
    if (value.length >= options.length) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, `the ${argument.name} may not be lower than \
${options.length} character${options.length === 1 ? '' : 's'}.`);
  }
}

module.exports = new MinimumLength();
