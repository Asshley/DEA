const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class Manageable extends ArgumentPrecondition {
  constructor() {
    super({ name: 'manageable' });
  }

  async run(command, msg, argument, args, value) {
    const member = msg.channel.guild.members.get(value.id);

    if (!member) {
      return PreconditionResult.fromSuccess();
    }

    const clientMember = msg.channel.guild.members.get(msg._client.user.id);

    if (member.id !== clientMember.id && member.id !== member.guild.ownerID
      && clientMember.highestRole.position > member.highestRole.position) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'I am unable to manage this user.');
  }
}

module.exports = new Manageable();
