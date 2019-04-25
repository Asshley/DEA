const { TypeReader, TypeReaderResult } = require('patron.js');
const NUMERIC_VALUES = {
  THOUSAND: 1e3,
  MILLION: 1e6,
  BILLION: 1e9
};

class Amount extends TypeReader {
  constructor() {
    super({ type: 'amount' });
  }

  async read(command, message, argument, args, input) {
    let value = Number.parseFloat(input);

    if (Number.isNaN(value) === false) {
      if (input.toLowerCase().endsWith('k')) {
        value *= NUMERIC_VALUES.THOUSAND;
      } else if (input.toLowerCase().endsWith('m')) {
        value *= NUMERIC_VALUES.MILLION;
      } else if (input.toLowerCase().endsWith('b')) {
        value *= NUMERIC_VALUES.BILLION;
      }

      return TypeReaderResult.fromSuccess(value);
    }

    return TypeReaderResult.fromError(
      command,
      `you have provided an invalid ${argument.name}`
    );
  }
}

module.exports = new Amount();
