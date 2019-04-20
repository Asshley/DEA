const { TypeReader, TypeReaderResult } = require('patron.js');
const NumberUtil = require('../utility/NumberUtil.js');
const HALF_DIVISOR = 2;

class CashTypeReader extends TypeReader {
  constructor() {
    super({ type: 'cash' });
    this.inputtedAll = null;
  }

  async read(command, message, argument, args, input) {
    if (input.toLowerCase() === 'all') {
      this.inputtedAll = true;

      return TypeReaderResult.fromSuccess(NumberUtil.value(message.dbUser.cash));
    } else if (input.toLowerCase() === 'half') {
      return TypeReaderResult.fromSuccess(NumberUtil.value(message.dbUser.cash / HALF_DIVISOR));
    }

    this.inputtedAll = false;

    const amountReader = message.client.registry.typeReaders.find(x => x.type === 'amount');
    const result = await amountReader.read(command, message, argument, args, input);

    if (!result.success) {
      return TypeReaderResult.fromError(
        command,
        result.errorReason
      );
    }

    return TypeReaderResult.fromSuccess(result.value);
  }
}

module.exports = new CashTypeReader();
