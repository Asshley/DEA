const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class Maximum extends ArgumentPrecondition {
  constructor() {
    super({ name: 'maximum' });
  }

  async run(command, msg, argument, args, value, options) {
    if (value <= options.maximum) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      `the maximum ${argument.name} is ${options.maximum}.`
    );
  }
}

module.exports = new Maximum();
