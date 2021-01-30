const { TypeReader, TypeReaderResult } = require('patron.js');
const NumberUtil = require('../utility/NumberUtil.js');
const HALF_DIVISOR = 2;

class Cash extends TypeReader {
  constructor() {
    super({ type: 'cash' });
    this.inputtedAll = false;
  }

  async read(command, message, argument, args, input) {
    const { cash } = await message._client.db.userRepo.getUser(message.author.id, message.guildID);

    if (input.toLowerCase() === 'all') {
      this.inputtedAll = true;

      return TypeReaderResult.fromSuccess(NumberUtil.value(cash));
    } else if (input.toLowerCase() === 'half') {
      return TypeReaderResult.fromSuccess(NumberUtil.value(cash / HALF_DIVISOR));
    }

    this.inputtedAll = false;

    const amountReader = message._client.registry.typeReaders.find(x => x.type === 'amount');
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

module.exports = new Cash();
