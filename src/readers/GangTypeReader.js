const { TypeReader, TypeReaderResult } = require('patron.js');
const Gang = require('../structures/Gang.js');

class GangTypeReader extends TypeReader {
  constructor() {
    super({ type: 'gang' });
  }

  async read(command, message, argument, args, input) {
    const gang = Gang.findGang(message.dbGuild, input);

    if (gang) {
      return TypeReaderResult.fromSuccess(gang);
    }

    return TypeReaderResult.fromError(command, 'this gang doesn\'t exist.');
  }
}

module.exports = new GangTypeReader();
