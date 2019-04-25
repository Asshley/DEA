const { TypeReader, TypeReaderResult } = require('patron.js');
const _Poll = require('../structures/Poll.js');

class Poll extends TypeReader {
  constructor() {
    super({ type: 'poll' });
  }

  async read(command, message, argument, args, input) {
    const poll = _Poll.findPoll(message.dbGuild, input);

    if (poll) {
      return TypeReaderResult.fromSuccess(poll);
    }

    return TypeReaderResult.fromError(command, 'this poll doesn\'t exist.');
  }
}

module.exports = new Poll();
