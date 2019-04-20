const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class Hierarchy extends ArgumentPrecondition {
  constructor() {
    super({ name: 'hierarchy' });
  }

  async run(command, msg, argument, args, value) {
    if (value.position < msg.guild.me.roles.highest.position) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, `${msg.client.user.username} must be higher \
in hierarchy than ${value}.`);
  }
}

module.exports = new Hierarchy();
