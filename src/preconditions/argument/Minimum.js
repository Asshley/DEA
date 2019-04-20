const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class Minimum extends ArgumentPrecondition {
  constructor() {
    super({ name: 'minimum' });
  }

  async run(command, msg, argument, args, value, options) {
    if (value >= options.minimum) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      `the minimum ${argument.name} is ${options.minimum}.`
    );
  }
}

module.exports = new Minimum();
