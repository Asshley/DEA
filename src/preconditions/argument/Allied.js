const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class Allied extends ArgumentPrecondition {
  constructor() {
    super({ name: 'allied' });
  }

  async run(command, msg, argument, args, value) {
    if (StringUtil.isNullOrWhiteSpace(value)) {
      const gang = msg.dbGang;

      if (gang) {
        const gangMembers = gang.members.concat(gang.leaderId);

        if (gangMembers.includes(args.member.id)) {
          return PreconditionResult.fromError(
            command,
            'you may not shoot or stab a member of your gang.'
          );
        }
      }
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new Allied();
