const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class NoSelf extends ArgumentPrecondition {
  constructor() {
    super({ name: 'noself' });
  }

  async run(command, msg, argument, args, value) {
    if (value.id !== msg.author.id) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'you may not use this command on yourself.');
  }
}

module.exports = new NoSelf();
