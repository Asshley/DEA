const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class NotBot extends ArgumentPrecondition {
  constructor() {
    super({ name: 'notbot' });
  }

  async run(command, msg, argument, args, value) {
    const user = value.user ? value.user : value;

    if (user.bot) {
      return PreconditionResult.fromError(command, 'you may not use this command on a bot.');
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new NotBot();
