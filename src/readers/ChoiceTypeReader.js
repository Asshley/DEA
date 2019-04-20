const { TypeReader, TypeReaderResult } = require('patron.js');

class ChoiceTypeReader extends TypeReader {
  constructor() {
    super({ type: 'choice' });
  }

  async read(command, message, argument, args, input) {
    const keys = Object.keys(args.poll.choices);
    const choice = keys.find((_, i) => i + 1 === Number(input));

    if (choice) {
      return TypeReaderResult.fromSuccess(choice);
    }

    return TypeReaderResult.fromError(command, 'this choice doesn\'t exist.');
  }
}

module.exports = new ChoiceTypeReader();
