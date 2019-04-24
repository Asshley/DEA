const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class Minimum extends ArgumentPrecondition {
  constructor() {
    super({ name: 'minimum' });
  }

  async run(command, msg, argument, args, value, options) {
    const min = options.minimum;

    if ((options.exclusive && value > min) || (!options.exclusive && value >= min)) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command, `the minimum ${argument.name} is ${min}.`
    );
  }
}

module.exports = new Minimum();
