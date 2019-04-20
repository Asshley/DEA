const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class UserHasCash extends ArgumentPrecondition {
  constructor() {
    super({ name: 'userhascash' });
  }

  async run(command, msg, argument, args, value) {
    const { cash } = await args.member.dbUser();
    const userValue = NumberUtil.value(cash);

    if (userValue < value) {
      return PreconditionResult.fromError(command, `this user doesn't have \
${NumberUtil.toUSD(value)}.`);
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new UserHasCash();
