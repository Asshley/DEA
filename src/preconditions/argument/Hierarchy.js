const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class Hierarchy extends ArgumentPrecondition {
  constructor() {
    super({ name: 'hierarchy' });
  }

  async run(command, msg, argument, args, value) {
    const clientMember = msg.channel.guild.members.get(msg._client.user.id);

    if (value.position < clientMember.highestRole.position) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, `${msg._client.user.username} must be higher \
in hierarchy than ${value}.`);
  }
}

module.exports = new Hierarchy();
