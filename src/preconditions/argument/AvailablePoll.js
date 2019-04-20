const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class AvailablePoll extends ArgumentPrecondition {
  constructor() {
    super({ name: 'availablepoll' });
  }

  async run(command, msg, argument, args, value) {
    if (msg.dbGuild.polls.some(x => x.name.toLowerCase() === value.toLowerCase())) {
      return PreconditionResult.fromError(
        command, 'a poll with this name already exists.'
      );
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new AvailablePoll();
