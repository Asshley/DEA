const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const {
  REGEXES: { NOT_INDEX }
} = require('../../utility/Constants.js');

class NotIndex extends ArgumentPrecondition {
  constructor() {
    super({ name: 'notindex' });
  }

  async run(command, msg, argument, args, value) {
    if (!NOT_INDEX.test(value)) {
      return PreconditionResult.fromError(
        command, `the ${argument.name} may not only consist of numbers`
      );
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new NotIndex();
