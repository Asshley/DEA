const { TypeReader, TypeReaderResult } = require('patron.js');
const Poll = require('../structures/Poll.js');

class PollTypeReader extends TypeReader {
  constructor() {
    super({ type: 'poll' });
  }

  async read(command, message, argument, args, input) {
    const poll = Poll.findPoll(message.dbGuild, input);

    if (poll) {
      return TypeReaderResult.fromSuccess(poll);
    }

    return TypeReaderResult.fromError(command, 'this poll doesn\'t exist.');
  }
}

module.exports = new PollTypeReader();
