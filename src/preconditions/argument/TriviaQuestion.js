const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const {
  REGEXES: { TRIVIA: TRIVIA_REGEX }
} = require('../../utility/Constants.js');

class TriviaQuestion extends ArgumentPrecondition {
  constructor() {
    super({ name: 'triviaquestion' });
  }

  async run(command, msg, argument, args, value) {
    if (TRIVIA_REGEX.test(value)) {
      return PreconditionResult.fromError(command, 'questions may only contain alphanumeric \
characters, whitespace, `?`, `(`, `)`, `\'`, or `*`.');
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new TriviaQuestion();
