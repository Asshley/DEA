const { TypeReader, TypeReaderResult } = require('patron.js');
const GangUtil = require('../utility/GangUtil.js');

class Gang extends TypeReader {
  constructor() {
    super({ type: 'gang' });
  }

  async read(command, message, argument, args, input) {
    const gang = GangUtil.find(message.dbGuild, input);

    if (gang) {
      return TypeReaderResult.fromSuccess(gang);
    }

    return TypeReaderResult.fromError(command, 'this gang doesn\'t exist.');
  }
}

module.exports = new Gang();
