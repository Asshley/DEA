const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const Util = require('../../utility/Util.js');

class MustBe extends ArgumentPrecondition {
  constructor() {
    super({ name: 'mustbe' });
  }

  async run(command, msg, argument, args, value, options) {
    const lowerValues = options.values.map(x => x.toLowerCase());

    if (!lowerValues.includes(value.toLowerCase())) {
      const string = Util.list(options.values, 'or');

      return PreconditionResult.fromError(command, `the ${argument.name} can only be ${string}.`);
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new MustBe();
