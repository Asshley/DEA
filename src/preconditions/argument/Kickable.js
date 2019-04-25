const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class Kickable extends ArgumentPrecondition {
  constructor() {
    super({ name: 'kickable' });
  }

  async run(command, msg, argument, args, value) {
    const clientMember = msg.guild.members.get(msg._client.user.id);

    if (value.id !== clientMember.id && value.id !== value.guild.ownerID
      && clientMember.highestRole.position > value.highestRole.position) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'I am unable to kick this member.');
  }
}

module.exports = new Kickable();
